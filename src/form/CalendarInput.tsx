import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {PopoverClose} from "@radix-ui/react-popover";
import React from "react";

export interface CalendarInputProps {
    value: any;
    onChange: (newValue: any) => void;
}

export default function CalendarInput({value, onChange}: CalendarInputProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "justify-start text-left font-normal inline-block w-full",
                        !value && "text-muted-foreground"
                    )}
                >
                    <div className="flex">
                        <CalendarIcon className="mr-2 h-4 w-4"/>
                        {value ? format(value, "P") :
                            <span>Pick a date</span>}</div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode={"single"}
                    initialFocus
                    selected={value}
                    onSelect={(newDate) => {
                        onChange(newDate ? newDate : new Date());
                    }}
                    defaultMonth={new Date(2010, 1)}
                    toDate={new Date()}
                />
                <PopoverClose>
                    X //TODO
                </PopoverClose>
            </PopoverContent>

        </Popover>
    )
}