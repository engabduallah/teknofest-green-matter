"use client"
import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { indigo, pink } from '@mui/material/colors';

import './App.css';
import FileManager from "./FileManager";

export default function Main() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = createTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: indigo[500]
      },
      secondary: {
        main: pink[500]
      },
      mode: prefersDarkMode ? 'dark' : 'light',
    }
  });

  const [selectedPage, setSelectedPage] = React.useState('home');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GreenMatter />
    </ThemeProvider>
  );
}


import { useState } from "react"
import { Home, FileText, Info } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function GreenMatter() {
  const [selectedPage, setSelectedPage] = useState("home")

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    selectedPage === "home" && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setSelectedPage("home")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    selectedPage === "viewer" && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setSelectedPage("viewer")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Viewer
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    selectedPage === "about" && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setSelectedPage("about")}
                >
                  <Info className="mr-2 h-4 w-4" />
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
      <main className="flex-1 container py-6">
        {selectedPage === "viewer" ? (
          <FileManager />
        ) : selectedPage === "home" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Welcome to Green Matter</CardTitle>
              <CardDescription>Your sustainable materials management solution</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select a page from the navigation bar above to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">About Green Matter</CardTitle>
              <CardDescription>Learn more about our application</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is an application for managing green materials. Our platform helps you organize, track, and
                optimize your sustainable material usage.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

