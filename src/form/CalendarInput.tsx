import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import React, {useState} from "react";
import {fieldAppearance} from "@/components/fieldAppearance";

export interface CalendarInputProps {
    value: any;
    onChange: (newValue: any) => void;
    shownYear: number
    disabled?: boolean
    canBeFuture?: boolean
    minDate?: Date
    onSelectCallback?: () => void;
}

export default function CalendarInput({
                                          value,
                                          onChange,
                                          shownYear,
                                          disabled = false,
                                          canBeFuture = false,
                                          minDate,
                                          onSelectCallback
                                      }: CalendarInputProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger disabled={disabled} className={cn(
                fieldAppearance,
                !value && "text-muted-foreground"
            )} type="button" onClick={() => setIsPopoverOpen(true)}>
                <div className="flex">
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {value ? format(value, "P") :
                        <span>Pick a date</span>}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    initialFocus
                    selected={value}
                    onSelect={(newDate) => {
                        onChange(newDate ? newDate : undefined);
                        setIsPopoverOpen(false);
                        onSelectCallback?.();
                    }}
                    defaultMonth={new Date(shownYear, 1)}
                    fromDate={minDate}
                    toDate={!canBeFuture ? new Date() : undefined}
                />
            </PopoverContent>
        </Popover>
    )
}