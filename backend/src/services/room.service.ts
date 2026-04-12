import db from "../config/db";


export async function getRooms() {
  return [
    { id: 1, name: "Room Alpha" },
    { id: 2, name: "Room Beta" }
  ];
}


export async function updateRoomCode(room: string, code: string) {
  const [result]: any = await db.query(
    "UPDATE rooms SET code = ? WHERE room = ?",
    [code, room]
  );

  return result.affectedRows > 0;
}