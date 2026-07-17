"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, toggleUserStatus, deleteUser } from '@/server/actions/master'
import { Search, Plus, MoreVertical, Filter, Download, Trash2, Edit2, ShieldAlert } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { UserModal } from './UserModal'

export function UsersDataTable() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'reset' | null>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: boolean }) => toggleUserStatus(id, status),
    onSuccess: (data: any) => {
      if (data?.error) alert(data.error)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (data: any) => {
      if (data?.error) alert(data.error)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const exportCSV = () => {
    if (!users || users.length === 0) return
    const headers = ['Nama', 'Email', 'Role', 'Desa', 'Status']
    const csvContent = [
      headers.join(','),
      ...users.map((u: any) => 
        `"${u.name}","${u.email}","${u.role}","${u.desa}","${u.isActive ? 'Aktif' : 'Nonaktif'}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'Data_Master_Pengguna.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Data Master Pengguna</h1>
          <p className="text-muted-foreground">Kelola hak akses dan pengguna di seluruh entitas desa.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-xl font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => {
              setModalMode('add')
              setSelectedUser(null)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-colors shadow-sm shadow-primary/25"
          >
            <Plus className="w-4 h-4" />
            Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-card shadow-sm border border-border/40">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, email, atau role..." 
              className="w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary/30 border border-border/50 rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col gap-4 py-8">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-full h-16 bg-secondary/30 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 rounded-xl">
                <tr>
                  <th className="px-4 py-4 rounded-tl-xl font-semibold">Pengguna</th>
                  <th className="px-4 py-4 font-semibold">Role</th>
                  <th className="px-4 py-4 font-semibold">Desa</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 rounded-tr-xl font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="relative">
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={user.id} 
                      className="border-b border-border/40 hover:bg-secondary/10 transition-colors group"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <Image src={user.avatar} alt={user.name} width={36} height={36} className="rounded-full bg-secondary object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{user.desa}</td>
                      <td className="px-4 py-4">
                        {(user.role === 'Admin' || user.role === 'Super Admin') ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {user.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        ) : (
                          <button 
                            onClick={() => toggleStatusMutation.mutate({ id: user.id, status: user.isActive })}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 ${user.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {user.isActive ? 'Aktif' : 'Nonaktif'}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right relative">
                        {user.role !== 'Admin' && user.role !== 'Super Admin' ? (
                          <>
                            <button 
                              onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                              className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none"
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>

                            <AnimatePresence>
                              {activeMenuId === user.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-8 top-10 w-48 bg-card border border-border shadow-xl rounded-xl overflow-hidden z-50 text-left"
                                  >
                                    <button 
                                      onClick={() => {
                                        setSelectedUser(user)
                                        setModalMode('edit')
                                        setActiveMenuId(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-secondary text-sm transition-colors"
                                    >
                                      <Edit2 className="w-4 h-4 text-muted-foreground" /> Edit Data
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSelectedUser(user)
                                        setModalMode('reset')
                                        setActiveMenuId(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-secondary text-sm transition-colors"
                                    >
                                      <ShieldAlert className="w-4 h-4 text-muted-foreground" /> Reset Password
                                    </button>
                                    <div className="border-t border-border/50 my-1" />
                                    <button 
                                      onClick={() => {
                                        deleteMutation.mutate(user.id)
                                        setActiveMenuId(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-rose-500/10 text-rose-500 text-sm transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" /> Hapus Akses
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <div className="w-8 inline-block" />
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {modalMode && (
        <UserModal 
          mode={modalMode} 
          user={selectedUser} 
          onClose={() => {
            setModalMode(null)
            setSelectedUser(null)
          }} 
        />
      )}
    </>
  )
}
