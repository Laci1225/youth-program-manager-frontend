import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {ControllerRenderProps, useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {Calendar} from "@/components/ui/calendar"
import {Calendar as CalendarIcon} from "lucide-react"
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {formSchema} from "@/form/formSchema";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {ChildData} from "@/model/child-data";

interface Disease {
    name: string,
    date: string
}

const client = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache(),
});

interface InputHandlerProps {
    field: ControllerRenderProps<{
        diseases: {
            name: string;
            date?: string | undefined;
        };
        familyName: string;
        givenName: string;
        birthPlace: string;
        address: string;
    }, "diseases">
    showDiseaseForm: boolean,
    setShowDiseaseForm: React.Dispatch<boolean>,
    diseases: Disease
    setDiseases: React.Dispatch<Disease>
}

function InputHandler({field, showDiseaseForm, setShowDiseaseForm, diseases, setDiseases}: InputHandlerProps) {
    const [showDisease2Form, setShowDisease2Form] = useState(false);
    const [diseaseName, setDiseaseName] = useState("");
    const [diseaseDate, setDiseaseDate] = useState("");
    const handleAddDisease = () => {
        const newDisease = {name: diseaseName, date: diseaseDate};
        setDiseases(newDisease)//[...diseases, newDisease]);
        setShowDisease2Form(false);
    };
    //TODO How to add object to the field handler
    return (
        <>
            <Input onClick={() => setShowDiseaseForm(true)}/>)

            {showDiseaseForm && (
                <div
                    className={"fixed bg-amber-100 rounded p-4 w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"}>
                    <Table>
                        <TableCaption>A list of added diseases.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/2">Name</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {//diseases?.map((disease) => (
                                <TableRow key={0}>
                                    <TableCell className="w-1/2">{diseases.name}</TableCell>
                                    <TableCell className="w-1/2">{diseases.date}</TableCell>
                                </TableRow>
                                //))
                            }

                        </TableBody>
                    </Table>
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowDiseaseForm(false)}>Cancel</Button>
                        <Button onClick={() => setShowDisease2Form(true)}>Add</Button>
                    </div>
                </div>
            )}

            {showDisease2Form &&
                <Card className="w-[350px] fixed  top-1/2 z-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <CardHeader>
                        <CardTitle>Add disease</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Name" value={diseaseName}
                                           onChange={(event) => setDiseaseName(event.target.value)}/>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="date">Name</Label>
                                    <Input id="date" placeholder="Date" value={diseaseDate}
                                           onChange={(event) => setDiseaseDate(event.target.value)}/>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowDisease2Form(false)}>Cancel</Button>
                        <Button onClick={handleAddDisease}>Add</Button>
                    </CardFooter>
                </Card>
            }
        </>)
}


function Children() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            familyName: "",
            givenName: "",
            //  birthDate: "",
            birthPlace: "",
            address: "",
            /*diseases: {name: "", date: ""},
            medicines: {name: "", dose: "", takenSince: ""}*/
        },
    })

    const [children, setChildren] = useState<ChildData[]>()

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        /*client
        .query({
            query: gql`
                query GetLocations {
                    children {
                        givenName
                    }
                }
            `,
        })
        .then((result) => console.log(result.data.children));
    */
    }


    const [date, setDate] = React.useState<Date>()
    const [showDiseaseForm, setShowDiseaseForm] = useState(false);
    //const [showMedicineForm, setShowMedicineForm] = useState(false);

    const [diseases, setDiseases] = useState<Disease>({name: "sds", date: "asd"});


    return (<div className={"container w-4/6 "}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, () => console.log("Valami nem jó"))}
                      className="flex justify-center flex-col space-y-8">
                    <FormField
                        control={form.control}
                        name="familyName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Family name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Family name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="givenName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Given name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Given name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Birthdate</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}

                                                value={date?.toTimeString()}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode={"single"}
                                                initialFocus
                                                selected={date}
                                                onSelect={setDate}
                                                defaultMonth={new Date(2010, 1)}
                                                toMonth={new Date()}
                                                //TODO How to add object to the field handler

                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthPlace"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Birth place</FormLabel>
                                <FormControl>
                                    <Input placeholder="Birth place" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Address" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="diseases"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Diseases</FormLabel>
                                <FormControl>
                                    <InputHandler field={field} diseases={diseases}
                                                  setDiseases={setDiseases} setShowDiseaseForm={setShowDiseaseForm}
                                                  showDiseaseForm={showDiseaseForm}/>
                                    {///<Input onClick={() => setShowDiseaseForm(true)} />
                                    }
                                </FormControl>
                            </FormItem>
                        )}
                    />{/*
                    <FormField
                        control={form.control}
                        name="medicines.name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Medicines</FormLabel>
                                <FormControl>
                                    <Input onClick={() => setShowMedicineForm(true)}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />*/}
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default Children;
