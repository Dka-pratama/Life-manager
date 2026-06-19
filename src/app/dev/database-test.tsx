import Screen from "@/components/layout/Screen";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import * as Repo from "@/repositories";
import { useState } from "react";
import db from "@/database/database";
import { ScrollView } from "react-native-gesture-handler";

export default function index() {
  const [result, setResult] = useState("");
  const testTaskRepo = async () => {
    let log = "";

    try {
      log += "===== TEST TASK =====\n\n";
        // buat task
      const taskId = await Repo.createTask({
        title: "Task Test",
        description: "Testing CRUD",
      });
        // Nampilin ke layar
      log += `✅ CREATE: ${taskId}\n\n`;
        // Ambil task
      const allTasks = await Repo.getTasks();
      log += `✅ GET ALL: ${allTasks.length} data\n\n`;
        // Ambil task per id
      const task = await Repo.getTaskById(Number(taskId));

      log += `✅ GET BY ID:\n`;
      log += JSON.stringify(task, null, 2);
      log += "\n\n";
        // Update task
      await Repo.updateTask(Number(taskId), {
        title: "Updated Task",
      });

      log += `✅ UPDATE SUCCESS\n\n`;
        // Hapus Task
      await Repo.deleteTask(Number(taskId));

      log += `✅ DELETE SUCCESS\n\n`;

      log += "🎉 TEST SELESAI";

      setResult(log);
    } catch (error) {
      setResult(`❌ ERROR:\n${String(error)}`);
    }
  };

  const testNoteRepo = async () => {
  let log = "";

  try {
    log += "===== TEST NOTE =====\n\n";

    const noteId = await Repo.CreateNote({
      title: "Note Test",
      content: "Testing Note",
    });

    log += `✅ CREATE: ${noteId}\n\n`;

    const notes = await Repo.getNotes();
    log += `✅ GET ALL: ${notes.length} data\n\n`;

    const note = await Repo.getNoteById(Number(noteId));

    log += `✅ GET BY ID:\n`;
    log += JSON.stringify(note, null, 2);
    log += `\n\n`;

    await Repo.UpdateNote(Number(noteId), {
      title: "Note Updated",
    })
    log += `✅ UPDATE SUCCESS\n\n`

    await Repo.DeleteNote(Number(noteId))
    log += `✅ DELETE SUCCESS \n\n`
    log += "🎉 TEST SELESAI";

    setResult(log);
  } catch (error) {
    setResult(`❌ ERROR:\n${String(error)}`);
  }
};

  const testFinanceCategoryRepo = async () => {
    let log = "";

    try {
      log += "==== TEST FINANCE Cat ====\n\n"

      const financeCatId = await Repo.CreateFinanceCategory({
        name: "Makan",
        type: "expense",
        icon: "Red",
        color: "yellow"
      });
      log += `✅CREATE: ${financeCatId}\n\n`;

      const financeCats = await Repo.getFinanceCategories();
      log += `✅ GET ALL: ${financeCats.length} data \n\n`;

      log += `ID = ${JSON.stringify(financeCatId)}\n`;
      const financeCat = await Repo.getFinanceCategoryById(Number(financeCatId))
      log += `✅ GET BY ID:\n`;
      log += JSON.stringify(financeCat, null, 2);
      log += `\n\n`;      

      await Repo.UpdateFinanceCategory(Number(financeCatId), {
        name: "Minum",
        type: "income",
        color: "Purple"
      })
      log += `✅ UPDATED SUCCES\n\n`

      await Repo.DeleteFinanceCategory(Number(financeCatId));
      log += `✅ DELETE SUCCES\n\n`
      log += "🎉 TEST SELESAI";
      setResult(log);
    } catch(error) {
      console.error(error);
      setResult(`❌ ERROR:\n${String(error)}`);
    }
  }

  const testFinanceTransactionRepo = async () => {
  let log = "";
  
  await Repo.CreateFinanceCategory({
        name: "Makan",
        type: "expense",
        icon: "Red",
        color: "yellow"
      });
  try {
    log += "===== TEST FINANCE TRANSACTION =====\n\n";

    // Ambil kategori pertama untuk foreign key
    const categories = await Repo.getFinanceCategories();

    if (categories.length === 0) {
      log += "❌ Tidak ada kategori finance\n";
      setResult(log);
      return;
    }

    const categoryId = Number(categories[0].id);

    // CREATE
    const transactionId = await Repo.CreateFinanceTransaction({
      category_id: categoryId,
      title: "Beli Kopi",
      amount: 15000,
      transaction_date: new Date().toISOString(),
    });

    log += `✅ CREATE: ${transactionId}\n\n`;

    // GET ALL
    const transactions = await Repo.getFinanceTransactions();

    log += `✅ GET ALL: ${transactions.length} data\n\n`;

    // GET BY ID
    const transaction = await Repo.getFinanceTransactionById(
      Number(transactionId)
    );

    log += `✅ GET BY ID:\n`;
    log += JSON.stringify(transaction, null, 2);
    log += "\n\n";

    // GET BY CATEGORY
    const categoryTransactions =
      await Repo.getTransactionByCategory(categoryId);

    log += `✅ GET BY CATEGORY: ${categoryTransactions.length} data\n\n`;

    // UPDATE
    const updated = await Repo.UpdateFinanceTransaction(
      Number(transactionId),
      {
        title: "Beli Kopi Susu",
        amount: 20000,
      }
    );

    log += `✅ UPDATE: ${updated}\n\n`;

    // CEK HASIL UPDATE
    const updatedTransaction =
      await Repo.getFinanceTransactionById(
        Number(transactionId)
      );

    log += `✅ AFTER UPDATE:\n`;
    log += JSON.stringify(updatedTransaction, null, 2);
    log += "\n\n";

    // DELETE
    const deleted = await Repo.DeleteFinanceTransaction(
      Number(transactionId)
    );

    log += `✅ DELETE: ${deleted}\n\n`;

    log += "🎉 TEST SELESAI";
  } catch (error) {
    log += `❌ ERROR:\n${String(error)}`;
  }

  setResult(log);
};

  const testHabitRepo = async () => {
  let log = "";

  try {
    log += "===== TEST HABIT =====\n\n";


    // CREATE
    const habitId = await Repo.createHabit({
      name: "Belajar",
      icon: "book",
      color: "purple",
      target_per_day: 10
    });

    log += `✅ CREATE: ${habitId}\n\n`;

    // GET ALL
    const habits = await Repo.getHabits();

    log += `✅ GET ALL: ${habits.length} data\n\n`;

    // GET BY ID
    const habit = await Repo.getHabitById(
      Number(habitId)
    );

    log += `✅ GET BY ID:\n`;
    log += JSON.stringify(habit, null, 2);
    log += "\n\n";


    // UPDATE
    const updated = await Repo.updateHabit(
      Number(habitId),
      {
        name: "Beli Kopi Susu",
        target_per_day: 20000,
      }
    );

    log += `✅ UPDATE: ${updated}\n\n`;

    // CEK HASIL UPDATE
    const updateHabit =
      await Repo.getHabitById(
        Number(habitId)
      );

    log += `✅ AFTER UPDATE:\n`;
    log += JSON.stringify(updateHabit, null, 2);
    log += "\n\n";

    // DELETE
    const deleted = await Repo.deleteHabit(
      Number(habitId)
    );

    log += `✅ DELETE: ${deleted}\n\n`;

    log += "🎉 TEST SELESAI";
  } catch (error) {
    log += `❌ ERROR:\n${String(error)}`;
  }

  setResult(log);
};

  const testHabitLogRepo = async () => {
  let log = "";

  try {
    await Repo.createHabit({
      name: "Belajar",
      icon: "book",
      color: "purple",
      target_per_day: 10
    });
    log += "===== TEST HABIT LOG =====\n\n";

    const habit = await Repo.getHabits()
    if (habit.length === 0) {
      log += "❌ Tidak ada Habits\n";
      setResult(log);
      return;
    }
    const habitId = Number(habit[0].id)
    const now = new Date().toISOString();
    // CREATE
    const habitLogId = await Repo.saveHabitProgress({
      habit_id: habitId,
      progress: 100,
      completed_date: now,
    });

    log += `✅ CREATE / UPDATE: ${habitLogId}\n\n`;

    // GET BY HABIT ID
    const habitLogByHabitId = await Repo.getHabitLogsByHabitId(habitId);

   log += `✅ GET LOG BY HABIT ID:\n`;
    log += JSON.stringify(habitLogByHabitId, null, 2);
    log += "\n\n";

    // GET BY DATE
    const habitlogByDate = await Repo.getHabitLogByDate(
      Number(habitId),
      now
    );

    log += `✅ GET BY DATE:\n`;
    log += JSON.stringify(habitlogByDate, null, 2);
    log += "\n\n";

    // DELETE
    const deleted = await Repo.deleteHabitLog(
      Number(habitId)
    );

    log += `✅ DELETE: ${deleted}\n\n`;

    log += "🎉 TEST SELESAI";
  } catch (error) {
    log += `❌ ERROR:\n${String(error)}`;
  }

  setResult(log);
};

const testTaskNoteRepo = async () => {
  let log = "";
  
  try {
    log += "===== TEST TASK NOTE RELATION =====\n\n";

    const task = await Repo.createTask({
        title: "Task Test",
        description: "Testing CRUD",
      });
      const taskId = Number(task)

      const note = await Repo.CreateNote({
      title: "Note Test",
      content: "Testing Note",
    });
    const noteId = Number(note)

    if (taskId === 0) {
      log += "❌ Tidak ada Task\n";
      setResult(log);
      return;
    }
    if (noteId === 0) {
      log += "❌ Tidak ada Note\n";
      setResult(log);
      return;
    }

    // CREATE
    const TaskNoteId = await Repo.CreateTaskNote({
      task_id: taskId,
      note_id: noteId
    });

    log += `✅ CREATE: ${TaskNoteId}\n\n`;

    // GET Task By Note ID
    const TaskByNote = await Repo.getTasksByNoteId(noteId);

    log += `✅ GET Task By Note: ${TaskByNote} \n\n`;
    log += JSON.stringify(TaskByNote, null, 2);
    log += `\n\n`;

    // GET Note By Task ID
    const NoteByTask = await Repo.getNotesByTaskId(taskId);

    log += `✅ GET NoteByTask:\n\n`;
    log += JSON.stringify(NoteByTask, null, 2);
    log += `\n\n`;


    // DELETE
    const deleted = await Repo.deleteTaskNote({
      task_id: taskId,
      note_id: noteId
    });

    log += `✅ DELETE: ${deleted}\n\n`;

    log += "🎉 TEST SELESAI";
  } catch (error) {
    log += `❌ ERROR:\n${String(error)}`;
  }

  setResult(log);
};

const clearDatabase = async () => {
  await db.execAsync(`
    DELETE FROM finance_transactions;
    DELETE FROM finance_categories;
    DELETE FROM tasks;
    DELETE FROM notes;
    DELETE FROM task_notes;
    DELETE FROM habits;
    DELETE FROM habit_logs;

    DELETE FROM sqlite_sequence;
  `);

  setResult("✅ Database berhasil dikosongkan");
};

  return (
    <Screen style={{ 
      gap: 1
     }}>
      <Button title="Clear All database" variant="outline" onPress={clearDatabase} />
      <Button title="Test Task" onPress={testTaskRepo} />
      <Button title="Test Note" onPress={testNoteRepo} />
      <Button title="Test Habit" onPress={testHabitRepo} />
      <Button title="Test Log Habit" onPress={testHabitLogRepo} />
      <Button title="Test Finance Category" onPress={testFinanceCategoryRepo} />
      <Button title="Test Finance Transaction" onPress={testFinanceTransactionRepo} />
      <Button title="Test Relasi Task Note" onPress={testTaskNoteRepo} />
      <ScrollView
        style={{
          marginTop: 20,
          maxHeight: 400,
        }}>
        <Text variant="body">{result}</Text>
      </ScrollView>
    </Screen>
  );
}
