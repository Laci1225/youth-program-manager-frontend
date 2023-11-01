import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {toast} from "@/components/ui/use-toast";
import CalendarInput from "@/form/CalendarInput";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import * as z from "zod";
import {diseaseSchema} from "@/form/formSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {handleSubmitStopPropagation} from "@/form/stopPropagation";

interface InputHandlerProps {
    value: any;
    onChange: (newValue: any) => void
}


export function InputDiseaseHandler({value, onChange}: InputHandlerProps) {
    const diseaseForm = useForm<z.infer<typeof diseaseSchema>>({
        resolver: zodResolver(diseaseSchema),
        defaultValues: {
            name: "",
            diagnosedAt: undefined
        }
    })
    const [isDialogOpen, setDialogOpen] = useState(false);

    function onDiseaseSubmit(values: z.infer<typeof diseaseSchema>) {
        onChange([...value ?? [], values]);
        toast({
            title: "Disease successfully added",
        })
        setDialogOpen(false);
    }

    return (
        <Dialog>
            <DialogTrigger asChild className="block w-full text-left">
                <Button className={"justify-start w-full border border-gray-700"}
                        type={"button"}
                        variant={"outline"}
                        onClick={() => {
                            setDialogOpen(true)
                            diseaseForm.reset()
                        }}>
                    Add a diagnosed disease
                </Button>
            </DialogTrigger>
            {isDialogOpen && (
                <DialogContent className="sm:max-w-[500px] h-[500px] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Create a disease</DialogTitle>
                    </DialogHeader>
                    <Form {...diseaseForm}>
                        <form
                            onSubmit={handleSubmitStopPropagation(diseaseForm)(onDiseaseSubmit)}>
                            <div className="grid w-full items-center gap-4">
                                <FormField
                                    control={diseaseForm.control}
                                    name={`name`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={diseaseForm.control}
                                    name={`diagnosedAt`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Diagnosed at*</FormLabel>
                                            <FormControl>
                                                <CalendarInput  {...field}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type={"submit"}>Add</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            )}
        </Dialog>
    )
}
