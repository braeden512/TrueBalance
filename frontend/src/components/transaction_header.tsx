"use client"

import { Button } from "@/components/ui/button";

export function TransactionHeader() {
    return (
        <div className="m-2 flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground">Current</p>
                <h2 className="text-lg font-bold">Recorded Transactions</h2>
            </div>

            {/* search bar will go here */}

            <Button variant="default" size="lg" className="px-3">
                Add Transaction
            </Button>
        </div>
    );
}