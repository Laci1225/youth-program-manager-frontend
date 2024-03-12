import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import React, {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {ScrollArea} from "@/components/ui/scroll-area"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import LoadingButton from "@/components/loading-button";
import {AutoComplete} from "@/form/AutoComplete";
import {Button} from "@/components/ui/button";
import AccessTokenContext from "@/context/access-token-context";
import {EmployeeData} from "@/model/employee-data";
import updateEmployee from "@/api/graphql/employee/updateEmployee";
import addEmployee from "@/api/graphql/employee/addEmployee";
import {InputPhoneNumbersHandler} from "@/form/parent/InputPhoneNumbersHandler";
import {employeeSchema} from "@/form/employee/employeeSchema";

interface EmployeeFormProps {
    onEmployeeModified: (employee: EmployeeData) => void;
    existingEmployee?: EmployeeData
    isOpen: boolean
    onOpenChange: (open: boolean) => void;
}

function EmployeeForm({
                          onEmployeeModified,
                          existingEmployee,
                          isOpen,
                          onOpenChange,
                      }: EmployeeFormProps) {
    const accessToken = useContext(AccessTokenContext)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof employeeSchema>>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            email: existingEmployee?.email,
            familyName: existingEmployee?.familyName,
            givenName: existingEmployee?.givenName,
            phoneNumber: existingEmployee?.phoneNumber,
            type: existingEmployee?.type,
        },
    })

    function onSubmit(values: z.infer<typeof employeeSchema>) {
        setIsSubmitting(true)
        if (existingEmployee) {
            updateEmployee(values, accessToken)
                .then((result) => {
                    onEmployeeModified(result)
                    toast({
                        title: "The employee is successfully updated",
                        description: `A employee with name: ${form.getValues("givenName")} ${form.getValues("familyName")} updated`,
                        duration: 2000
                    })
                    onOpenChange(false)
                }).catch(reason => {
                toast({
                    variant: "destructive",
                    title: reason.message,
                    duration: 2000
                })
            }).finally(() => {
                setIsSubmitting(false)
            })
        } else {
            addEmployee(values, accessToken)
                .then((result) => {
                    onEmployeeModified(result)
                    toast({
                        title: "The employee is successfully added",
                        description: `A employee with name: ${form.getValues("givenName")} ${form.getValues("familyName")} created`,
                        duration: 2000
                    })
                    onOpenChange(false)
                }).catch(reason => {
                toast({
                    variant: "destructive",
                    title: reason.toString(),
                    duration: 2000
                })
            }).finally(() => {
                setIsSubmitting(false)
            })
        }
    }

    useEffect(() => {
        form.reset({
            email: existingEmployee?.email ?? "",
            familyName: existingEmployee?.familyName ?? "",
            givenName: existingEmployee?.givenName ?? "",
            phoneNumber: existingEmployee?.phoneNumber ?? undefined,
            type: existingEmployee?.type ?? undefined,
        })
    }, [existingEmployee])

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[800px] h-[90vh] shadow-muted-foreground">
                    <DialogHeader>
                        <DialogTitle>{existingEmployee ? "Update" : "Create"} a employee</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
                              className="flex justify-center flex-col space-y-4 mx-4">
                            <ScrollArea className="h-[70vh]">
                                <div className="mx-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Family name*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email address" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex">
                                        <FormField
                                            control={form.control}
                                            name="familyName"
                                            render={({field}) => (
                                                <FormItem className="flex-1">
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
                                                <FormItem className="flex-1">
                                                    <FormLabel>Given name*</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Given name" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Phone numbers*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={"Scheme: +36200000000"}
                                                           {...field}/>
                                                </FormControl>
                                                <FormMessage
                                                    hidden={!form.formState.errors.phoneNumber?.message}/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Address" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </ScrollArea>
                            <DialogFooter>
                                <LoadingButton isLoading={isSubmitting}>
                                    {existingEmployee ? "Update" : "Create"}
                                </LoadingButton>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default EmployeeForm;
