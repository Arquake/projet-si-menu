import { create } from "zustand";
import {combine} from "zustand/middleware";
import {Account} from "../types/Account.ts";


export const userStore = create(
    combine({
        account: undefined as undefined | null | Account
    }, (set) => ({
        setAccount: (account: Account | null): void => set({account})
    }))
);
