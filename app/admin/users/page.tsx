"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Users,
    Search,
    Filter,
    Trash2,
    Shield,
    User,
    Calendar,
    Mail,
    Loader2,
    AlertTriangle,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
    getAllUsers,
    getUsersByRole,
    deleteUser,
    bulkDeleteUsers,
    bulkUpdateUserRoles,
    UserRole
} from '@/lib/services/admin-service'

export default function UsersPage() {
    const [users, setUsers] = useState<UserRole[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserRole[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [bulkAction, setBulkAction] = useState<'delete' | 'role' | null>(null)
    const [newRole, setNewRole] = useState<'admin' | 'user'>('user')
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showRoleDialog, setShowRoleDialog] = useState(false)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, searchTerm, roleFilter])

    const loadUsers = async () => {
        try {
            setLoading(true)
            const data = await getAllUsers()
            setUsers(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load users. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = users

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter)
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.uid.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredUsers(filtered)
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
    }

    const handleRoleFilter = (value: 'all' | 'admin' | 'user') => {
        setRoleFilter(value)
    }

    const handleSelectUser = (uid: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers(prev => [...prev, uid])
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== uid))
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(filteredUsers.map(user => user.uid))
        } else {
            setSelectedUsers([])
        }
    }

    const handleBulkDelete = async () => {
        if (selectedUsers.length === 0) {
            toast({
                title: "No users selected",
                description: "Please select users to delete.",
                variant: "destructive",
            })
            return
        }

        setShowDeleteDialog(true)
    }

    const confirmBulkDelete = async () => {
        try {
            setProcessing(true)
            const result = await bulkDeleteUsers(selectedUsers)

            if (result.success.length > 0) {
                toast({
                    title: "Success",
                    description: `Successfully deleted ${result.success.length} user(s).`,
                })
            }

            if (result.failed.length > 0) {
                toast({
                    title: "Partial Success",
                    description: `Failed to delete ${result.failed.length} user(s).`,
                    variant: "destructive",
                })
            }

            setSelectedUsers([])
            await loadUsers()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete users. Please try again.",
                variant: "destructive",
            })
        } finally {
            setProcessing(false)
            setShowDeleteDialog(false)
        }
    }

    const handleBulkRoleUpdate = async () => {
        if (selectedUsers.length === 0) {
            toast({
                title: "No users selected",
                description: "Please select users to update.",
                variant: "destructive",
            })
            return
        }

        setShowRoleDialog(true)
    }

    const confirmBulkRoleUpdate = async () => {
        try {
            setProcessing(true)
            const updates = selectedUsers.map(uid => ({ uid, role: newRole }))
            const result = await bulkUpdateUserRoles(updates)

            if (result.success.length > 0) {
                toast({
                    title: "Success",
                    description: `Successfully updated ${result.success.length} user(s) to ${newRole} role.`,
                })
            }

            if (result.failed.length > 0) {
                toast({
                    title: "Partial Success",
                    description: `Failed to update ${result.failed.length} user(s).`,
                    variant: "destructive",
                })
            }

            setSelectedUsers([])
            await loadUsers()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user roles. Please try again.",
                variant: "destructive",
            })
        } finally {
            setProcessing(false)
            setShowRoleDialog(false)
        }
    }

    const handleDeleteUser = async (uid: string) => {
        try {
            await deleteUser(uid)
            toast({
                title: "Success",
                description: "User deleted successfully.",
            })
            await loadUsers()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete user. Please try again.",
                variant: "destructive",
            })
        }
    }

    const getRoleBadge = (role: 'admin' | 'user') => {
        return role === 'admin' ? (
            <Badge variant="default" className="bg-red-500 hover:bg-red-600">
                <Shield className="h-3 w-3 mr-1" />
                Admin
            </Badge>
        ) : (
            <Badge variant="secondary">
                <User className="h-3 w-3 mr-1" />
                User
            </Badge>
        )
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Users</h1>
                        <p className="text-muted-foreground">Loading users...</p>
                    </div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading users...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Users</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Manage user accounts and permissions
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-sm">
                        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                    </Badge>
                </div>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Filters & Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Users</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by email or UID..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Role Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="role-filter">Filter by Role</Label>
                            <Select value={roleFilter} onValueChange={handleRoleFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admins Only</SelectItem>
                                    <SelectItem value="user">Users Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bulk Actions */}
                        <div className="space-y-2">
                            <Label>Bulk Actions</Label>
                            <div className="flex space-x-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                    disabled={selectedUsers.length === 0}
                                    className="flex-1"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={handleBulkRoleUpdate}
                                    disabled={selectedUsers.length === 0}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                                >
                                    <Shield className="h-4 w-4 mr-1" />
                                    Update Role
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">User List</CardTitle>
                    <CardDescription>
                        Manage user accounts, roles, and permissions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead className="w-20">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center space-y-2">
                                                <Users className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-muted-foreground">No users found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.uid}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedUsers.includes(user.uid)}
                                                    onCheckedChange={(checked) => handleSelectUser(user.uid, checked as boolean)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-medium">{user.email}</p>
                                                    <p className="text-sm text-muted-foreground font-mono">
                                                        {user.uid.substring(0, 8)}...
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{formatDate(user.createdAt)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{formatDate(user.updatedAt)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteUser(user.uid)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Users</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedUsers.length} selected user(s)?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmBulkDelete}
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Users'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Role Update Confirmation Dialog */}
            <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update User Roles</AlertDialogTitle>
                        <AlertDialogDescription>
                            Update {selectedUsers.length} selected user(s) to a new role.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-role">New Role</Label>
                            <Select value={newRole} onValueChange={(value: 'admin' | 'user') => setNewRole(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmBulkRoleUpdate}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Roles'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
} 