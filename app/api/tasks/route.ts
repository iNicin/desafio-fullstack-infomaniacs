import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";
import { createTaskSchema } from "@/schemas/task.schema";

type TaskRow = RowDataPacket & {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
};

export async function GET(req: Request) {
  try {
    const userId = getAuthUserId(req);

    const [rows] = await pool.query<TaskRow[]>(
      `SELECT id, title, description, status, created_at, updated_at
       FROM tasks WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    return NextResponse.json({ tasks: rows }, { status: 200 });
  } catch (error) {
    console.error("TASKS_GET_ERROR:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = getAuthUserId(req);
    const body = await req.json();

    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { title, description, status } = parsed.data;
    const finalStatus = status ?? "pending";

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)",
      [userId, title, description ?? null, finalStatus]
    );

    const [created] = await pool.query<TaskRow[]>(
      `SELECT id, title, description, status, created_at, updated_at
       FROM tasks WHERE id = ? AND user_id = ?`,
      [result.insertId, userId]
    );

    return NextResponse.json({ task: created[0] }, { status: 201 });
  } catch (error) {
    console.error("TASKS_POST_ERROR:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
