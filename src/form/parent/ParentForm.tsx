import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Button, ButtonProps} from "@/components/ui/button";
import React, {ReactNode, useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {ScrollArea} from "@/components/ui/scroll-area"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import LoadingButton from "@/components/loading-button";
import {parentSchema} from "@/form/parent/parentSchema";
import addParent from "@/api/graphql/parent/addParent";

interface ParentFormProps {
    onParentCreated: (parent: ParentData) => void;
    triggerName: ReactNode
    triggerVariant?: ButtonProps["variant"]
}

function ParentForm({onParentCreated, triggerName, triggerVariant}: ParentFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof parentSchema>>({
        resolver: zodResolver(parentSchema),
        defaultValues: {
            familyName: undefined,
            givenName: undefined,
            phoneNumbers: undefined,
            address: undefined,
        },
    })

    const [isDialogOpen, setDialogOpen] = useState(false);

    function onSubmit(values: z.infer<typeof parentSchema>) {
        setIsSubmitting(true)

        addParent(values)
            .then((result) => {
                const addedParent = result.data.addParent;

                onParentCreated(addedParent)
                toast({
                    title: "The parent is successfully added",
                    description: `A parent with name: ${form.getValues("givenName")} ${form.getValues("familyName")} created`,
                })
                setDialogOpen(false)
            }).catch(reason => {
            toast({
                variant: "destructive",
                title: reason.toString(),
            })
        }).finally(() => {
            setIsSubmitting(false)
        })
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => {
                    setDialogOpen(true)
                    form.reset()
                }} variant={triggerVariant}
                >{triggerName}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[90vh] shadow-muted-foreground">
                <DialogHeader>
                    <DialogTitle>Create a parent</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                          className="flex justify-center flex-col space-y-4 mx-4">
                        <ScrollArea className="h-[70vh]">
                            <div className="mx-4">
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
                                    name="phoneNumbers"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Phone numbers*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Phone numbers" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem className={"flex-1"}>
                                            <FormLabel>Address*</FormLabel>
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
                            <LoadingButton type="submit" isLoading={isSubmitting}/>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ParentForm;
