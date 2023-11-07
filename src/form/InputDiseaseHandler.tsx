import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "@/components/ui/use-toast";
import CalendarInput from "@/form/CalendarInput";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import * as z from "zod";
import {diseaseSchema} from "@/form/formSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {handleSubmitStopPropagation} from "@/form/stopPropagation";
import {Disease} from "@/model/disease";

interface InputHandlerProps {
    value?: Disease[];
    onChange: (newValue: Disease[]) => void;
}


export function InputDiseaseHandler({value, onChange}: InputHandlerProps) {
    const diseaseForm = useForm<z.infer<typeof diseaseSchema>>({
        resolver: zodResolver(diseaseSchema),
        defaultValues: {
            name: "",
            diagnosedAt: undefined
            // todo validateResolver
        }
    })
    const [isDialogOpen, setDialogOpen] = useState(false);

    function onDiseaseSubmit(values: z.infer<typeof diseaseSchema>) {
        if (!(value ?? []).map((disease) => disease.name).includes(values.name)) {
            onChange([...(value ?? []), values]);
            toast({
                title: "Disease successfully added",
                duration: 2000
            });
            setDialogOpen(false);
        } else {
            diseaseForm.setFocus('name')
            diseaseForm.setError('name', {message: "Name already chosen"})
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className={"flex justify-end"}
                        type={"button"}
                        variant={"default"}
                        onClick={() => {
                            setDialogOpen(true)
                            diseaseForm.reset()
                        }}>
                    Add a diagnosed disease
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Create a disease</DialogTitle>
                </DialogHeader>
                <Form {...diseaseForm}>
                    <form
                        onSubmit={handleSubmitStopPropagation(diseaseForm)(onDiseaseSubmit)}>
                        <FormField
                            control={diseaseForm.control}
                            name={`name`}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} defaultValue={field.value}/>
                                    </FormControl>
                                    <FormMessage/>
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
                                        <CalendarInput  {...field} shownYear={2016}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type={"submit"}>Add</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
