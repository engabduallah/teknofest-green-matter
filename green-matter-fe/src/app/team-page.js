"use client"

import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Sample team data - replace with your actual team members
const teamMembers = [
    {
        name: "Abdulkarim Lahmuni",
        bio: "6th year medical student at university of istanbul-cerrahpaşa, faculty of medicine. Backend developer, worked on several projects, particularly with fastapi framework(python).",
        avatar: "/assets/profiles/abdulkarim.png",
    },
    {
        name: "Adnan Fahed",
        bio: "Software Engineer with 4 years of professional experience in full-stack application development and a research background in machine learning and large language models. Currently pursuing an MSc in Computer Engineering, preparing research for publication in ML and LLMs. Skilled in building scalable applications, data-driven solutions, and integrating advanced AI techniques into software systems.",
        avatar: "/assets/profiles/adnan.png",
    },
    {
        name: "Abdullah Damash",
        bio: "Master’s student in biomedical engineering at ODTÜ, currently working as a senior AI engineer at a healthcare company in the Netherlands. Has over 5 years of experience in software development and AI engineering, specializing in applying artificial intelligence to medical solutions.",
        avatar: "/assets/profiles/damash.png",
    },
    {
        name: "Muhammed Eyüp",
        bio: "Computer Engineer graduated from Gebze Technical University in 2023 and currently working as a software engineer with 2 years of experience in payment systems development using C++ and Python, Previously worked as a Full- Stack developer using ReactJS and Go.Currently learning AI fundamentals to pursue a master's degree in Artificial Intelligence.",
        avatar: "/assets/profiles/eyup.png",
    },
    {
        name: "Muhammed İkbal Alboushi",
        bio: "AI Engineer with over 2 years of professional and research experience in developing data-driven solutions and predictive models, primarily within the finance and healthcare sectors. Proficient in data collection, transformation, and creating ETL/ELT processes to ensure data accuracy and enhance system performance. I’ve contributed to high-impact projects such as financial forecasting and deep learning-based diagnostic systems, focusing on data preprocessing, model development, and maintaining data quality.",
        avatar: "/assets/profiles/ikbal.png",
    },
]

export default function TeamPage() {
    return (
        <div className="flex justify-center">

            <div className="container py-10">
                <div className="space-y-4 text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight">Our Team</h1>
                    <p className="text-muted-foreground max-w-[700px] mx-auto">
                        Meet the experts behind Green Matter. Our diverse team combines expertise in materials science, environmental
                        research, and software development to create innovative solutions for sustainable materials management.
                    </p>
                    <Separator className="my-4 mx-auto w-[100px]" />
                </div>

                <div className="w-full justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                    </Avatar>
                                    <div>
                                        <CardTitle>{member.name}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{member.bio}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

