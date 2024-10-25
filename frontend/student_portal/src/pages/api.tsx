"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Copy, Check, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
    SidebarGroupLabel,
    

} from "@/components/ui/sidebar"


import { Collapsible,
    CollapsibleContent,
    CollapsibleTrigger} from "@/components/ui/collapsible"

const apiData = {
  base_url: "/api/v1",
  routes: [
    {
      "name": "auth",
      "path": "/auth",
      "endpoints": [
        {
          "title": "Register Student",
          "method": "POST",
          "path": "/registerStudent",
          "description": "Registers a new student user with the provided email, password, name, and school.",
          "security": "None",
          "headers": {
            "Content-Type": "application/json"
          },
          "requestBody": {
            "email": { "type": "string", "description": "Student's email address", "required": true },
            "password": { "type": "string", "description": "Student's password", "required": true },
            "name": { "type": "string", "description": "Student's full name", "required": true },
            "school": { "type": "string", "description": "Student's school", "required": true }
          },
          "requestExample": `{
    "email": "student@example.com",
    "password": "securePassword",
    "name": "John Doe",
    "school": "Example High School"
  }`,
          "responses": [
            { "code": 200, "description": "Success." },
            { "code": 400, "description": "Email, password and name are required" },
            { "code": 409, "description": "This email is already registered! Please login or use a different email." }
          ],
          "responseExample": `{
    "_id": "60c72b2f5f1b2c001c8e4d5a",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student",
    "school": "Example High School",
    "game_profile": {
      "game_points": 0,
      "game_minutes_left": 60
    }
  }`
        },
        {
          "title": "Register Teacher",
          "method": "POST",
          "path": "/registerTeacher",
          "description": "Registers a new teacher user with the provided email, password, name, and school.",
          "security": "None",
          "headers": {
            "Content-Type": "application/json"
          },
          "requestBody": {
            "email": { "type": "string", "description": "Teacher's email address", "required": true },
            "password": { "type": "string", "description": "Teacher's password", "required": true },
            "name": { "type": "string", "description": "Teacher's full name", "required": true },
            "school": { "type": "string", "description": "Teacher's school", "required": true }
          },
          "requestExample": `{
    "email": "teacher@example.com",
    "password": "securePassword",
    "name": "Jane Doe",
    "school": "Example High School"
  }`,
          "responses": [
            { "code": 200, "description": "Success." },
            { "code": 400, "description": "Email, password and name are required" },
            { "code": 409, "description": "This email is already registered! Please login or use a different email." }
          ],
          "responseExample": `{
    "_id": "60c72b2f5f1b2c001c8e4d5a",
    "email": "teacher@example.com",
    "name": "Jane Doe",
    "role": "teacher",
    "school": "Example High School",
    "game_profile": {
      "game_points": 0,
      "game_minutes_left": 60
    }
  }`
        },
        {
          "title": "Login",
          "method": "POST",
          "path": "/login",
          "description": "Logs in a user by validating their email and password. Returns a JWT token if successful.",
          "security": "None",
          "headers": {
            "Content-Type": "application/json"
          },
          "requestBody": {
            "email": { "type": "string", "description": "User's email address", "required": true },
            "password": { "type": "string", "description": "User's password", "required": true }
          },
          "requestExample": `{
    "email": "student@example.com",
    "password": "securePassword"
  }`,
          "responses": [
            { "code": 200, "description": "Success." },
            { "code": 400, "description": "Email and password are required" },
            { "code": 401, "description": "Invalid email or password" }
          ],
          "responseExample": `{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }`
        },
        {
          "title": "Get Profile",
          "method": "GET",
          "path": "/profile",
          "description": "Retrieves the user's profile based on the JWT token provided.",
          "security": "JWT",
          "headers": {
            "Authorization": "Bearer <token>"
          },
          "requestExample": `{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }`,
          "responses": [
            { "code": 200, "description": "Success." },
            { "code": 401, "description": "Invalid token" }
          ],
          "responseExample": `{
    "_id": "60c72b2f5f1b2c001c8e4d5a",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student",
    "school": "Example High School",
    "game_profile": {
      "game_points": 0,
      "game_minutes_left": 60
    }
  }`
        },
        {
          "title": "Update Password",
          "method": "PUT",
          "path": "/updatePassword",
          "description": "Allows an authenticated user to update their password by providing the old password and new password.",
          "security": "JWT",
          "headers": {
            "Authorization": "Bearer <token>",
            "Content-Type": "application/json"
          },
          "requestBody": {
            "oldPassword": { "type": "string", "description": "The old password", "required": true },
            "password": { "type": "string", "description": "The new password", "required": true }
          },
          "requestExample": `{
    "oldPassword": "oldPassword123",
    "password": "newSecurePassword456"
  }`,
          "responses": [
            { "code": 200, "description": "Success." },
            { "code": 400, "description": "Please enter your old and new passwords!" },
            { "code": 401, "description": "Unauthorized" },
            { "code": 401, "description": "Invalid old password!" },
            { "code": 401, "description": "User does not exist" }
          ],
          "responseExample": `{
    "_id": "60c72b2f5f1b2c001c8e4d5a",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student",
    "school": "Example High School"
  }`
        }
      ]
    },
    
        {
          "name": "classroom",
          "path": "/classroom",
          "endpoints": [
            {
              "title": "Create Classroom",
              "method": "POST",
              "path": "/create",
              "description": "Creates a new classroom, only accessible by teachers.",
              "security": "JWT",
              "headers": {
                "Content-Type": "application/json"
              },
              "requestBody": {
                "classroom": {
                  "name": { "type": "string", "description": "Name of the classroom", "required": true },
                  "teacher": { "type": "string", "description": "Teacher ID (must be the user creating it)", "required": true },
                  "students_enrolled": { "type": "array", "description": "Array of student IDs", "required": false }
                }
              },
              "requestExample": `{
                "classroom": {
                  "name": "Math 101",
                  "teacher": "64c2b2d0f8e9e7a123456789"
                }
              }`,
              "responses": [
                { "code": 200, "description": "Classroom created successfully." },
                { "code": 400, "description": "Invalid data or missing fields." },
                { "code": 403, "description": "Only teachers can create classrooms." }
              ],
              "responseExample": `{
                "name": "Math 101",
                "teacher": "64c2b2d0f8e9e7a123456789",
                "class_join_code": 123456,
                "students_enrolled": [],
                "_id": "60c72b2f5f1b2c001c8e4d5b"
              }`
            },
            {
              "title": "Join Classroom",
              "method": "POST",
              "path": "/join/:code",
              "description": "Allows a student to join a classroom using a unique class code.",
              "security": "JWT",
              "headers": {
                "Content-Type": "application/json"
              },
              "params": {
                "code": { "type": "string", "description": "Classroom join code", "required": true }
              },
              "responses": [
                { "code": 200, "description": "Joined classroom successfully." },
                { "code": 400, "description": "Invalid classroom code or user already enrolled." }
              ],
              "responseExample": `{
                "classroom": {
                  "id": "60c72b2f5f1b2c001c8e4d5b",
                  "students_enrolled": [
                    { "student": "60c72b2f5f1b2c001c8e4d5c", "is_new_exercise_submission": false }
                  ]
                },
                "user": {
                  "_id": "60c72b2f5f1b2c001c8e4d5d",
                  "classroom": ["60c72b2f5f1b2c001c8e4d5b"],
                  "role": "student",
                  "name": "Jane Doe"
                }
              }`
            },
            {
              "title": "Get Classroom by ID",
              "method": "GET",
              "path": "/:id",
              "description": "Fetches classroom details using its ID.",
              "security": "JWT",
              "params": {
                "id": { "type": "string", "description": "Classroom ID", "required": true }
              },
              "responses": [
                { "code": 200, "description": "Classroom details returned successfully." },
                { "code": 400, "description": "Invalid ID." }
              ],
              "responseExample": `{
                "_id": "60c72b2f5f1b2c001c8e4d5b",
                "name": "Math 101",
                "teacher": "60c72b2f5f1b2c001c8e4d5a",
                "students_enrolled": [],
                "announcement": "No new updates.",
                "is_game_blocked": false
              }`
            },
            {
              "title": "Set Today's Unit",
              "method": "PUT",
              "path": "/setTodayUnit/:id",
              "description": "Sets today's unit for a specific classroom.",
              "security": "JWT",
              "headers": {
                "Content-Type": "application/json"
              },
              "params": {
                "id": { "type": "string", "description": "Classroom ID", "required": true }
              },
              "requestBody": {
                "title": { "type": "string", "description": "Title of today's unit", "required": true },
                "unit": { "type": "string", "description": "Unit ID", "required": true }
              },
              "responses": [
                { "code": 200, "description": "Today's unit set successfully." },
                { "code": 400, "description": "Invalid data or missing fields." }
              ],
              "responseExample": `{
                "_id": "60c72b2f5f1b2c001c8e4d5b",
                "today_unit": { "title": "Introduction to Algebra", "unit": "60c72b2f5f1b2c001c8e4d5e" }
              }`
            },
            {
              "title": "Set Announcement",
              "method": "PUT",
              "path": "/setAnnouncement/:id",
              "description": "Updates the classroom announcement.",
              "security": "JWT",
              "headers": {
                "Content-Type": "application/json"
              },
              "params": {
                "id": { "type": "string", "description": "Classroom ID", "required": true }
              },
              "requestBody": {
                "announcement": { "type": "string", "description": "New announcement text", "required": true }
              },
              "responses": [
                { "code": 200, "description": "Announcement updated successfully." },
                { "code": 400, "description": "Invalid data or missing fields." }
              ],
              "responseExample": `{
                "_id": "60c72b2f5f1b2c001c8e4d5b",
                "announcement": "Please submit your homework by Friday."
              }`
            },
            {
              "title": "Set Game Block Status",
              "method": "PUT",
              "path": "/setGameBlock/:id",
              "description": "Sets whether games are blocked in the classroom.",
              "security": "JWT",
              "headers": {
                "Content-Type": "application/json"
              },
              "params": {
                "id": { "type": "string", "description": "Classroom ID", "required": true }
              },
              "requestBody": {
                "is_game_blocked": { "type": "boolean", "description": "Whether games are blocked", "required": true }
              },
              "responses": [
                { "code": 200, "description": "Game block status updated successfully." },
                { "code": 400, "description": "Invalid data or missing fields." }
              ],
              "responseExample": `{
                "_id": "60c72b2f5f1b2c001c8e4d5b",
                "is_game_blocked": true
              }`
            },
            {
              "title": "Set Game Restriction Period",
              "method": "PUT",
              "path": "/setGameRestrictionPeriod/:id",
              "description": "Sets the game restriction period for a classroom.",
              "security": "JWT",
              "headers": {
                "Content-Type": "application/json"
              },
              "params": {
                "id": { "type": "string", "description": "Classroom ID", "required": true }
              },
              "requestBody": {
                "start": { "type": "string", "description": "Start time of restriction", "required": true },
                "end": { "type": "string", "description": "End time of restriction", "required": true }
              },
              "responses": [
                { "code": 200, "description": "Game restriction period updated successfully." },
                { "code": 400, "description": "Invalid data or missing fields." }
              ],
              "responseExample": `{
                "_id": "60c72b2f5f1b2c001c8e4d5b",
                "game_restriction_period": { "start": "2024-10-10T09:00:00Z", "end": "2024-10-10T10:00:00Z" }
              }`
            }
          ]
        }
    
      
      
  ]  
}

const methodColors = {
  GET: "bg-blue-500 text-white",
  POST: "bg-emerald-500 text-white",
  PUT: "bg-amber-500 text-white",
  DELETE: "bg-rose-500 text-white"
}

export default function ApiDocsViewer() {
  const [selectedRoute, setSelectedRoute] = useState(0)
  const [selectedEndpoint, setSelectedEndpoint] = useState(0)
  const [copiedField, setCopiedField] = useState("")

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(""), 2000)
  }

  const route = apiData.routes[selectedRoute]
  const endpoint = route.endpoints[selectedEndpoint]

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Sidebar variant="floating" className="border-r bg-white dark:bg-gray-800">
          <SidebarHeader>
            <h2 className="text-xl font-bold px-4 py-4 text-gray-800 dark:text-white">API Reference</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 pb-4">Base URL: {apiData.base_url}</p>
          </SidebarHeader>
          <SidebarContent>
            {apiData.routes.map((route, routeIndex) => (
              <SidebarMenu key={routeIndex}>
                <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
          {route.name}
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
                {route.endpoints.map((ep, epIndex) => (
                  <SidebarMenuItem key={epIndex}>
                    <SidebarMenuButton
                      isActive={selectedRoute === routeIndex && selectedEndpoint === epIndex}
                      onClick={() => {
                        setSelectedRoute(routeIndex)
                        setSelectedEndpoint(epIndex)
                      }}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Badge className={`mr-2 ${methodColors[ep.method]}`}>
                        {ep.method}
                      </Badge>
                      <span className="text-gray-700 dark:text-gray-300">{ep.path}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                </CollapsibleContent>
                </SidebarGroup>
                </Collapsible>
              </SidebarMenu>
            ))}
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{endpoint.title}</h1>
            <SidebarTrigger />
          </div>
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto p-8 space-y-10">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Request</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{endpoint.description}</p>
                {endpoint.security !== "None" && (
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg flex items-center space-x-2 mb-6">
                    <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Security: {endpoint.security}</span>
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <Badge className={`${methodColors[endpoint.method]} text-sm px-3 py-1`}>
                      {endpoint.method}
                    </Badge>
                    <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{apiData.base_url + route.path + endpoint.path}</span>
                  </div>
                  {endpoint.headers && (<><h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Headers</h3>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-md mb-4">
                    {Object.entries(endpoint.headers).map(([key, value], index) => (
                      <div key={index} className="mb-2">
                        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{key}: </span>
                        <span className="text-gray-600 dark:text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div></>)}
                  {endpoint.requestBody && (<><h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Request Body</h3>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-md mb-4">
                    {Object.entries(endpoint.requestBody).map(([key, value], index) => (
                      <div key={index} className="mb-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{key}</span>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">{value.type}</span>
                          {value.required && <Badge variant="destructive" className="text-xs">required</Badge>}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
                      </div>
                    ))}
                  </div></>)}
                  {endpoint.requestExample &&  <><h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Example Request</h3>
                  <div className="bg-gray-800 p-4 rounded-md relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(endpoint.requestExample, "request")}
                    >
                      {copiedField === "request" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                      {endpoint.requestExample}
                    </pre>
                  </div>
                  </>}
                </div>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Responses</h2>
                <div className="flex space-x-2 mb-6">
                  {endpoint.responses.map((response, index) => (
                    <Badge key={index} variant={response.code === 200 ? "default" : "secondary"} className="text-sm px-3 py-1">
                      {response.code}
                    </Badge>
                  ))}
                </div>
                <Tabs defaultValue="200" className="w-full">
                  <TabsList className="mb-4">
                    {endpoint.responses.map((response) => (
                      <TabsTrigger key={response.code} value={response.code.toString()} className="px-4 py-2">
                        {response.code}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {endpoint.responses.map((response) => (
                    <TabsContent key={response.code} value={response.code.toString()}>
                      <div className="bg-gray-800 p-4 rounded-lg relative">
                        {response.code === 200 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                            onClick={() => copyToClipboard(endpoint.responseExample, "response")}
                          >
                            {copiedField === "response" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        )}
                        <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                          {response.code === 200 ? endpoint.responseExample : response.description}
                        </pre>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  )
}