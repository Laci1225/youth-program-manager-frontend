import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import React, {useState} from "react";

export interface CalendarInputProps {
    value: any;
    onChange: (newValue: any) => void;
    shownYear: number
}

export default function CalendarInput({value, onChange, shownYear}: CalendarInputProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger className={cn(
                "justify-start font-normal text-left flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                !value && "text-muted-foreground"
            )} type={"button"} onClick={() => setIsPopoverOpen(true)}>
                <div className="flex">
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {value ? format(value, "P") :
                        <span>Pick a date</span>}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode={"single"}
                    initialFocus
                    selected={value}
                    onSelect={(newDate) => {
                        onChange(newDate ? newDate : undefined);
                        setIsPopoverOpen(false);
                    }}
                    defaultMonth={new Date(shownYear, 1)}
                    toDate={new Date()}
                />
            </PopoverContent>
        </Popover>
    )
}