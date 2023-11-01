import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {Dispatch, SetStateAction, useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {formSchema} from "@/form/formSchema";
import {InputDiseaseHandler} from "@/form/InputDiseaseHandler";
import {InputMedicinesHandler} from "@/form/InputMedicinesHandler";
import {toast} from "@/components/ui/use-toast";
import addChild from "@/api/graphql/addChild";
import CalendarInput from "@/form/CalendarInput";
import ShowTable from "@/form/ShowTable";
import {ScrollArea} from "@/components/ui/scroll-area"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {ChildData} from "@/model/child-data";

interface ChildFormProps {
    setChildren: Dispatch<SetStateAction<ChildData[]>>
}

function ChildForm({setChildren}: ChildFormProps) {

    const [receivedAnswer, setReceivedAnswer] = useState(true)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            familyName: "",
            givenName: "",
            birthDate: undefined,
            birthPlace: "",
            address: "",
            diagnosedDiseases: undefined,
            regularMedicines: undefined
        },
    })

    const [isDialogOpen, setDialogOpen] = useState(false);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setReceivedAnswer(false)
        console.log(values)

        addChild(values)
            .then((result) => {
                const addedChild = result.data.addChild;

                setChildren(prevState => [...prevState, addedChild])
                toast({
                    title: "The child is successfully added",
                    description: form.getValues("givenName") + " " + form.getValues("familyName"),
                })
                setReceivedAnswer(true)
                setDialogOpen(false)
            }).catch(reason => {
                toast({
                    variant: "destructive",
                    title: reason.toString(),
                })
                setReceivedAnswer(true)

            }
        )
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => {
                    setDialogOpen(true)
                    form.reset()
                }}>+ Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Create a child</DialogTitle>
                </DialogHeader>
                <div className={""}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                              className="flex justify-center flex-col space-y-4 mx-4">
                            <ScrollArea className="h-[80vh] mx-4 overflow-auto">
                                <FormField
                                    control={form.control}
                                    name="familyName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Family name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Family name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="givenName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Given name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Given name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="birthDate"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Birthdate*</FormLabel>
                                                <FormControl>
                                                    <CalendarInput {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="birthPlace"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Birth place*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Birth place" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Address*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Address" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="diagnosedDiseases"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={"block"}>Diagnosed diseases*</FormLabel>
                                            <FormControl>
                                                <InputDiseaseHandler {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                            <ShowTable tableFields={["Name", "Diagnosed at"]} {...field}/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="regularMedicines"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Regular medicines</FormLabel>
                                            <FormControl>
                                                <InputMedicinesHandler {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                            <ShowTable tableFields={["Name", "Dose", "Taken since"]} {...field}/>
                                        </FormItem>
                                    )}
                                />
                            </ScrollArea>
                            {receivedAnswer ?
                                <Button type="submit">Submit</Button>
                                :
                                <div className="text-center">
                                    <div role="status">
                                        <svg aria-hidden="true"
                                             className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"/>
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            }
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ChildForm;
