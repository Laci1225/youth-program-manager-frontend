import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import HoverText from "@/components/hoverText";
import {Switch} from "@/components/ui/switch";
import {Info} from "lucide-react";
import CalendarInput from "@/form/CalendarInput";
import {Input} from "@/components/ui/input";
import React from "react";
import {ControllerRenderProps, UseFormReturn} from "react-hook-form";

interface InputCalendarProps {
    days: number | undefined;
    setDays: React.Dispatch<React.SetStateAction<number | undefined>>;
    calcDateByGivenDate: () => void;
    calcDateByGivenDay: (days: number) => void;
    form: UseFormReturn<any>;
    value: any;
    onChange: (value: any) => void;
}

export default function InputCalendarSwitch({
                                                days,
                                                setDays,
                                                calcDateByGivenDay,
                                                calcDateByGivenDate,
                                                form,
                                                value,
                                                onChange
                                            }: InputCalendarProps) {
    const [disable, setDisable] = React.useState(false);

    return (<FormItem className="w-full">
        <div className="flex">
            <FormLabel>Valid until*</FormLabel>
            <HoverText
                content={`Edit ${disable ? " days " : " date "} instead `}>

                <div className="flex ml-4 text-xs cursor-pointer"
                     onClick={
                         () => setDisable(!disable)}>
                    <div className="flex items-center space-x-2">
                        <Switch/>
                    </div>
                    <Info className="h-4"/>
                </div>
            </HoverText>
        </div>
        <FormControl>
            <div className="flex">
                <div className="w-1/3 px-2">
                    <CalendarInput
                        value={value}
                        onChange={onChange}
                        shownYear={new Date().getFullYear()}
                        disabled={!disable}
                        canBeFuture={true}
                        onSelectCallback={calcDateByGivenDate}
                        minDate={form.getValues("issueDate")}
                    />
                </div>
                <div className="relative w-1/3 px-2">
                    <Input
                        disabled={disable}
                        onClick={() => setDisable(false)}
                        onInput={(event) => {
                            if (!!Number(event.currentTarget.value))
                                calcDateByGivenDay(Number(event.currentTarget.value));
                            else setDays(undefined)
                        }}
                        value={days}
                        className="pr-10"
                    />
                    <span
                        className="absolute mr-2 inset-y-0 right-0 flex items-center pr-2">
                                                                        day(s)
                                                                    </span>
                </div>
            </div>
        </FormControl>
        <FormMessage/>
    </FormItem>)
}