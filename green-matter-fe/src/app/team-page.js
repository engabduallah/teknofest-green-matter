"use client"

import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Sample team data - replace with your actual team members
const teamMembers = [
    {
        name: "Dr. Sarah Chen",
        role: "Lead Researcher",
        bio: "Ph.D. in Materials Science with 10+ years of experience in sustainable materials research and development.",
        avatar: "/placeholder.svg?height=400&width=400",
        initials: "SC",
        links: {
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            email: "mailto:sarah@greenmatter.com",
        },
    },
    {
        name: "Michael Rodriguez",
        role: "Software Engineer",
        bio: "Specialized in medical imaging software with expertise in DICOM standards and 3D visualization techniques.",
        avatar: "/placeholder.svg?height=400&width=400",
        initials: "MR",
        links: {
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            email: "mailto:michael@greenmatter.com",
        },
    },
    {
        name: "Dr. Aisha Patel",
        role: "Environmental Scientist",
        bio: "Expert in lifecycle assessment of materials with a focus on reducing environmental impact in manufacturing.",
        avatar: "/placeholder.svg?height=400&width=400",
        initials: "AP",
        links: {
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            email: "mailto:aisha@greenmatter.com",
        },
    },
    {
        name: "James Wilson",
        role: "UI/UX Designer",
        bio: "Creating intuitive interfaces for complex scientific applications with a focus on accessibility and user experience.",
        avatar: "/placeholder.svg?height=400&width=400",
        initials: "JW",
        links: {
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com",
            email: "mailto:james@greenmatter.com",
        },
    },
    {
        name: "Dr. Olivia Kim",
        role: "Materials Specialist",
        bio: "Specializing in biodegradable polymers and their applications in sustainable product development.",
        avatar: "/placeholder.svg?height=400&width=400",
        initials: "OK",
        links: {
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            email: "mailto:olivia@greenmatter.com",
        },
    },
    {
        name: "Robert Taylor",
        role: "Project Manager",
        bio: "Coordinating research initiatives and product development with a background in sustainable business practices.",
        avatar: "/placeholder.svg?height=400&width=400",
        initials: "RT",
        links: {
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com",
            email: "mailto:robert@greenmatter.com",
        },
    },
]

export default function TeamPage() {
    return (
        <div className="container py-10">
            <div className="space-y-4 text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight">Our Team</h1>
                <p className="text-muted-foreground max-w-[700px] mx-auto">
                    Meet the experts behind Green Matter. Our diverse team combines expertise in materials science, environmental
                    research, and software development to create innovative solutions for sustainable materials management.
                </p>
                <Separator className="my-4 mx-auto w-[100px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-primary/10">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{member.name}</CardTitle>
                                    <CardDescription>{member.role}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{member.bio}</p>
                        </CardContent>
                        <CardFooter className="flex gap-2 pt-2">
                            {member.links.twitter && (
                                <Button variant="ghost" size="icon" asChild>
                                    <a href={member.links.twitter} target="_blank" rel="noopener noreferrer">
                                        <Twitter className="h-4 w-4" />
                                        <span className="sr-only">Twitter</span>
                                    </a>
                                </Button>
                            )}
                            {member.links.linkedin && (
                                <Button variant="ghost" size="icon" asChild>
                                    <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="h-4 w-4" />
                                        <span className="sr-only">LinkedIn</span>
                                    </a>
                                </Button>
                            )}
                            {member.links.github && (
                                <Button variant="ghost" size="icon" asChild>
                                    <a href={member.links.github} target="_blank" rel="noopener noreferrer">
                                        <Github className="h-4 w-4" />
                                        <span className="sr-only">GitHub</span>
                                    </a>
                                </Button>
                            )}
                            {member.links.email && (
                                <Button variant="ghost" size="icon" asChild>
                                    <a href={member.links.email}>
                                        <Mail className="h-4 w-4" />
                                        <span className="sr-only">Email</span>
                                    </a>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

