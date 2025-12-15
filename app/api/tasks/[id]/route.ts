import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";
import { updateTaskSchema } from "@/schemas/task.schema";

type Context = { params: Promise<{ id: string }> };

type TaskRow = RowDataPacket & {
  id: number;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
};

export async function PUT(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    const userId = getAuthUserId(req);

    const taskId = Number(id);
    if (!id || Number.isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid task id" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { title, description, status } = parsed.data;

    const fields: string[] = [];
    const values: (string | null)[] = [];

    if (title !== undefined) { fields.push("title = ?"); values.push(title); }
    if (description !== undefined) { fields.push("description = ?"); values.push(description); }
    if (status !== undefined) { fields.push("status = ?"); values.push(status); }

    if (fields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
      [...values, taskId, userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const [updated] = await pool.query<TaskRow[]>(
      `SELECT id, title, description, status, created_at, updated_at
       FROM tasks WHERE id = ? AND user_id = ?`,
      [taskId, userId]
    );

    return NextResponse.json({ task: updated[0] }, { status: 200 });
  } catch (error) {
    console.error("TASKS_PUT_ERROR:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    const userId = getAuthUserId(req);

    const taskId = Number(id);
    if (!id || Number.isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid task id" }, { status: 400 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [taskId, userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error("TASKS_DELETE_ERROR:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
