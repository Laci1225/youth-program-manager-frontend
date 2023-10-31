import {useForm, UseFormReturn} from "react-hook-form";
import React from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {toast} from "@/components/ui/use-toast";
import CalendarInput from "@/form/CalendarInput";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import * as z from "zod";
import {diseaseSchema} from "@/form/formSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {handleSubmitStopPropagation} from "@/form/stopPropagation";

interface InputHandlerProps {
    form:
        UseFormReturn<{
            diagnosedDiseases: {
                name: string;
                diagnosedAt: Date;
            }[];
            address: string;
            familyName: string;
            givenName: string;
            birthDate: Date;
            birthPlace: string;
            regularMedicines?: {
                name: string;
                dose: string;
                takenSince?: any;
            }[] | undefined;
        }>
}


export function InputDiseaseHandler({form,}: InputHandlerProps) {

    const diseaseForm = useForm<z.infer<typeof diseaseSchema>>({
        resolver: zodResolver(diseaseSchema),
        defaultValues: {
            name: "",
            diagnosedAt: undefined
        }
    })

    function onDiseaseSubmit(values: z.infer<typeof diseaseSchema>) {
        form.setValue("diagnosedDiseases", [...(form.getValues("diagnosedDiseases")), values], {shouldValidate: true})
        console.log(form.getValues("diagnosedDiseases"))
        toast({
            title: "Disease successfully added",
            //description: diseaseName +" "+ diseaseDiagnosedAt,
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={"w-full h-full"} type={"button"} inputMode={"none"}
                        variant={"ghost"}>
                    Add a diagnosed disease
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-full overflow-auto">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <Form {...diseaseForm}>
                    <form
                        onSubmit={handleSubmitStopPropagation(diseaseForm)(onDiseaseSubmit, () => "Other string")}>
                        <div className="grid w-full items-center gap-4">
                            <FormField
                                control={diseaseForm.control}
                                name={`name`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
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
                                        <FormLabel>Diagnosed at</FormLabel>
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
                <DialogFooter>
                    <Button type="button">Save changes</Button>{//todo
                }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
