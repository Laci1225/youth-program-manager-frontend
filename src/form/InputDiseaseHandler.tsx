import {UseFormReturn} from "react-hook-form";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {ToastAction} from "@/components/ui/toast";
import {toast} from "@/components/ui/use-toast";
import {Toaster} from "@/components/ui/toaster";

export interface Disease {
    //id: number;
    name: string;
    diagnosedAt: any;//TODO any
}// TODO not in a good place
export interface Medicine {
    //id: number;
    name: string;
    dose: string;
    takenSince: any;
}


interface InputHandlerProps {
    diseases: Disease[]
    setDiseases: React.Dispatch<Disease[]>
    form:
        UseFormReturn<{ diseases: { name: string; diagnosedAt: Date; }[]; }, any, undefined>
}

export function InputDiseaseHandler({
                                        diseases,
                                        setDiseases,
                                        form
                                    }: InputHandlerProps) {
    //const [diseaseID, setDiseaseID] = useState(0);
    const [diseaseName, setDiseaseName] = useState("");
    const [diseaseDiagnosedAt, setDiseaseDiagnosedAt] = useState<Date>();
    const handleAddDisease = () => {
        const newDisease = {name: diseaseName, diagnosedAt: diseaseDiagnosedAt};
        setDiseases([...diseases, newDisease])
        //setDiseaseID(diseaseID + 1)
    };
    //<Button variant="outline" onClick={() => setShowDiseaseForm(false)}>Cancel</Button>
    return (
        <div className="grid w-full items-center gap-4">
            <FormField
                control={form.control}
                name={`diseases.${diseases.length}.name`}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Name"
                                   onChange={
                                       (event) => {
                                           setDiseaseName(event.target.value)
                                           form.setValue(`diseases.${diseases.length}.name`, event.target.value, {shouldValidate: true})
                                       }}/>
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`diseases.${diseases.length}.diagnosedAt`}
                render={({field}) => (
                        <FormItem>
                            <FormLabel>Diagnosed at</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !diseaseDiagnosedAt && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                            {diseaseDiagnosedAt ? format(diseaseDiagnosedAt, "PPP") :
                                                <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode={"single"}
                                            initialFocus
                                            selected={diseaseDiagnosedAt}
                                            onSelect={(newDate) => {
                                                form.setValue(`diseases.${diseases.length}.diagnosedAt`, newDate ? newDate : new Date(), {shouldValidate: true});
                                                setDiseaseDiagnosedAt(newDate);
                                            }}
                                            defaultMonth={new Date(2018, 1)}
                                            toMonth={new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                        </FormItem>
                    )
                }
            />
                        <Button onClick={()=>{
                            handleAddDisease()
                            toast({
                                title: "Disease successfully added",
                                description: diseaseName +" "+ diseaseDiagnosedAt,
                                action: (
                                    <ToastAction altText="Goto schedule to undo" ></ToastAction>
                                ),
                            })}
                        }>Add</Button>
        </div>)
}

//<Button variant="outline" onClick={() => setShowDisease2Form(false)}>Cancel</Button>
