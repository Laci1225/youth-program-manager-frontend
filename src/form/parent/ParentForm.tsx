import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {ScrollArea} from "@/components/ui/scroll-area"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import LoadingButton from "@/components/loading-button";
import {parentSchema} from "@/form/parent/parentSchema";
import addParent from "@/api/graphql/parent/addParent";
import {InputPhoneNumbersHandler} from "@/form/parent/InputPhoneNumbersHandler";
import updateParent from "@/api/graphql/parent/updateParent";
import {ParentData, ParentDataWithChildrenIds} from "@/model/parent-data";
import {AutoComplete} from "@/form/AutoComplete";
import getPotentialChildren from "@/api/graphql/parent/getPotentialChildren";
import {Button} from "@/components/ui/button";
import {ChildData} from "@/model/child-data";
import ChildForm from "@/form/child/ChildForm";

interface ParentFormProps {
    onParentModified: (parent: ParentData) => void;
    existingParent?: ParentDataWithChildrenIds
    isOpen: boolean
    onOpenChange: (open: boolean) => void;
    onChildFormClicked?: boolean

}

function ParentForm({onParentModified, existingParent, isOpen, onOpenChange, onChildFormClicked}: ParentFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof parentSchema>>({
        resolver: zodResolver(parentSchema),
        defaultValues: {
            familyName: existingParent?.familyName,
            givenName: existingParent?.givenName,
            phoneNumbers: existingParent?.phoneNumbers,
            address: existingParent?.address,
        },
    })

    const [isChildEditDialogOpen, setIsChildEditDialogOpen] = useState(false)

    function handleChildEditClick() {
        setIsChildEditDialogOpen(true)
    }

    function onSubmit(values: z.infer<typeof parentSchema>) {
        setIsSubmitting(true)
        if (existingParent) {
            const updateValues = {
                ...values,
                id: existingParent.id,
                childIds: existingParent.childIds
            };
            updateParent(updateValues)
                .then((result) => {
                    onParentModified(result)
                    toast({
                        title: "The parent is successfully updated",
                        description: `A parent with name: ${form.getValues("givenName")} ${form.getValues("familyName")} updated`,
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
            const {
                child,
                ...parentFields
            } = values;
            addParent({...parentFields, childId: child?.id})
                .then((result) => {
                    onParentModified(result)
                    console.log(result)
                    toast({
                        title: "The parent is successfully added",
                        description: `A parent with name: ${form.getValues("givenName")} ${form.getValues("familyName")} created`,
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
            familyName: existingParent?.familyName ?? "",
            givenName: existingParent?.givenName ?? "",
            phoneNumbers: existingParent?.phoneNumbers ?? undefined,
            address: existingParent?.address ?? "",
        })
    }, [existingParent])

    function onChildUpdated(child: ChildData) {
        form.setValue("child", {...child, birthDate: new Date(child.birthDate)})
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[800px] h-[90vh] shadow-muted-foreground">
                    <DialogHeader>
                        <DialogTitle>{existingParent ? "Update" : "Create"} a parent</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
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
                                    {!existingParent && !onChildFormClicked &&
                                        <FormField
                                            control={form.control}
                                            name="child"
                                            render={({field}) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>Child</FormLabel>
                                                    <FormControl>
                                                        <div className="flex justify-between">
                                                            <AutoComplete
                                                                className="w-2/3"
                                                                isLoading={false}
                                                                disabled={false}
                                                                value={field.value && field.value}
                                                                getPotential={getPotentialChildren}
                                                                isAdded={false}
                                                                onValueChange={(value) => {
                                                                    if (!value) {
                                                                        field.onChange(undefined);
                                                                        return;
                                                                    }
                                                                    field.onChange({
                                                                        ...value,
                                                                        birthDate: new Date(value.birthDate)
                                                                    })
                                                                }}
                                                                placeholder="Select children..."
                                                                emptyMessage="No child found"
                                                            />
                                                            <Button type="button"
                                                                    onClick={() => {
                                                                        handleChildEditClick()
                                                                    }}>
                                                                Create
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    }
                                    <FormField
                                        control={form.control}
                                        name="phoneNumbers"
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Phone numbers*</FormLabel>
                                                <FormControl>
                                                    <InputPhoneNumbersHandler {...field}
                                                                              errors={form.formState.errors.phoneNumbers || []}
                                                    />
                                                </FormControl>
                                                <FormMessage
                                                    hidden={!form.formState.errors.phoneNumbers?.message}/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
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
                                    {existingParent ? "Update" : "Create"}
                                </LoadingButton>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            {isChildEditDialogOpen &&
                <ChildForm
                    isOpen={isChildEditDialogOpen}
                    onOpenChange={setIsChildEditDialogOpen}
                    onChildModified={onChildUpdated}
                    onParentFormClicked={true}
                />}
        </>
    );
}

export default ParentForm;
