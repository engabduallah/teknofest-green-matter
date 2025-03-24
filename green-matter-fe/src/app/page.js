"use client"
import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { indigo, pink } from '@mui/material/colors';
import { useState } from "react"
import { FileText, Users, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import FileManager from "./file-manager"
import TeamPage from "./team-page"
import PredictPage from "./predict-page"

import './App.css';

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GreenMatter />
    </ThemeProvider>
  );
}




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
                    selectedPage === "predict" && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setSelectedPage("predict")}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Predict
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    selectedPage === "team" && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setSelectedPage("team")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Team
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
      <main className="flex-1 py-6">
        {selectedPage === "viewer" ? (
          <FileManager />
        ) : selectedPage === "team" ? (
          <TeamPage />
        ) : <><PredictPage /></>}
      </main>
    </div>
  )
}

