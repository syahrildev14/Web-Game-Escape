import { create } from "zustand";
import axios from "axios";

type RoomCodeState = {
    codes: Record<string, string>;
    loading: boolean;

    fetchCodes: () => Promise<void>;
    updateCode: (room: string, code: string) => Promise<void>;
};

export const useGameStore = create<RoomCodeState>((set) => ({
    codes: {},
    loading: false,

    fetchCodes: async () => {
        try {
            set({ loading: true });

            const res = await axios.get("http://localhost:5000/api/rooms/all");

            set({ codes: res.data, loading: false });
        } catch (err) {
            console.error(err);
            set({ loading: false });
        }
    },

    updateCode: async (room, code) => {
        await axios.put(`http://localhost:5000/api/rooms/code/${room}`, {
            code,
        });

        // refresh setelah update
        const res = await axios.get("http://localhost:5000/api/rooms/all");
        set({ codes: res.data });
    },
}));