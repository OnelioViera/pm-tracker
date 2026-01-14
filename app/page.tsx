'use client';

import { useState, useEffect } from 'react';
import { Plus, Briefcase, CheckCircle2, Clock, XCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ProjectManager {
  _id: string;
  name: string;
  email?: string;
  company?: string;
}

interface Work {
  _id: string;
  title: string;
  description?: string;
  projectManagerId: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
}

interface Job {
  _id: string;
  title: string;
  description?: string;
  projectManagerId: string;
  status: 'active' | 'on-hold' | 'completed' | 'cancelled';
  budget?: number;
  startDate?: string;
  endDate?: string;
}

export default function Home() {
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([]);
  const [selectedPM, setSelectedPM] = useState<string | null>(null);
  const [work, setWork] = useState<Work[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAddPM, setShowAddPM] = useState(false);
  const [showAddWork, setShowAddWork] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);

  // Form states
  const [pmForm, setPMForm] = useState({ name: '', email: '', company: '' });
  const [workForm, setWorkForm] = useState({ title: '', description: '', status: 'pending' as const });
  const [jobForm, setJobForm] = useState({ title: '', description: '', status: 'active' as const, budget: '' });

  useEffect(() => {
    fetchProjectManagers();
  }, []);

  useEffect(() => {
    if (selectedPM) {
      fetchWork(selectedPM);
      fetchJobs(selectedPM);
    }
  }, [selectedPM]);

  const fetchProjectManagers = async () => {
    const res = await fetch('/api/project-managers');
    const data = await res.json();
    if (data.success) setProjectManagers(data.data);
  };

  const fetchWork = async (pmId: string) => {
    const res = await fetch(`/api/work?pmId=${pmId}`);
    const data = await res.json();
    if (data.success) setWork(data.data);
  };

  const fetchJobs = async (pmId: string) => {
    const res = await fetch(`/api/jobs?pmId=${pmId}`);
    const data = await res.json();
    if (data.success) setJobs(data.data);
  };

  const addProjectManager = async () => {
    if (!pmForm.name) return;
    const res = await fetch('/api/project-managers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pmForm),
    });
    const data = await res.json();
    if (data.success) {
      setProjectManagers([data.data, ...projectManagers]);
      setPMForm({ name: '', email: '', company: '' });
      setShowAddPM(false);
    }
  };

  const addWork = async () => {
    if (!workForm.title || !selectedPM) return;
    const res = await fetch('/api/work', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...workForm, projectManagerId: selectedPM }),
    });
    const data = await res.json();
    if (data.success) {
      setWork([data.data, ...work]);
      setWorkForm({ title: '', description: '', status: 'pending' });
      setShowAddWork(false);
    }
  };

  const addJob = async () => {
    if (!jobForm.title || !selectedPM) return;
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...jobForm,
        projectManagerId: selectedPM,
        budget: jobForm.budget ? parseFloat(jobForm.budget) : undefined,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setJobs([data.data, ...jobs]);
      setJobForm({ title: '', description: '', status: 'active', budget: '' });
      setShowAddJob(false);
    }
  };

  const updateWorkStatus = async (workId: string, newStatus: Work['status']) => {
    const res = await fetch(`/api/work/${workId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      setWork(work.map(w => w._id === workId ? { ...w, status: newStatus } : w));
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: Job['status']) => {
    const res = await fetch(`/api/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      setJobs(jobs.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
    }
  };

  const deleteWork = async (workId: string) => {
    await fetch(`/api/work/${workId}`, { method: 'DELETE' });
    setWork(work.filter(w => w._id !== workId));
  };

  const deleteJob = async (jobId: string) => {
    await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    setJobs(jobs.filter(j => j._id !== jobId));
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      'in-progress': 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      completed: 'bg-green-500/10 text-green-700 border-green-500/20',
      active: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      'on-hold': 'bg-orange-500/10 text-orange-700 border-orange-500/20',
      cancelled: 'bg-red-500/10 text-red-700 border-red-500/20',
    };
    return (
      <Badge variant="outline" className={statusColors[status] || ''}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    }}>
      <div className="container mx-auto p-8">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
            PM Tracker
          </h1>
          <p className="text-white/80 text-lg" style={{ fontFamily: "'Space Mono', monospace" }}>
            Manage your work across project managers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Managers Column */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl">Project Managers</CardTitle>
                  </div>
                  <Button
                    onClick={() => setShowAddPM(!showAddPM)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {showAddPM && (
                  <div className="space-y-3 p-4 rounded-lg bg-purple-50/50 border border-purple-200/50">
                    <Input
                      placeholder="Name *"
                      value={pmForm.name}
                      onChange={(e) => setPMForm({ ...pmForm, name: e.target.value })}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={pmForm.email}
                      onChange={(e) => setPMForm({ ...pmForm, email: e.target.value })}
                    />
                    <Input
                      placeholder="Company"
                      value={pmForm.company}
                      onChange={(e) => setPMForm({ ...pmForm, company: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button onClick={addProjectManager} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        Add PM
                      </Button>
                      <Button onClick={() => setShowAddPM(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {projectManagers.length === 0 && !showAddPM && (
                  <p className="text-center text-muted-foreground py-8">No project managers yet</p>
                )}
                
                {projectManagers.map((pm, index) => (
                  <div
                    key={pm._id}
                    onClick={() => setSelectedPM(pm._id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPM === pm._id
                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="font-semibold text-lg">{pm.name}</div>
                    {pm.company && (
                      <div className={`text-sm mt-1 ${selectedPM === pm._id ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {pm.company}
                      </div>
                    )}
                    {pm.email && (
                      <div className={`text-xs mt-1 font-mono ${selectedPM === pm._id ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {pm.email}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Work & Jobs Columns */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Work Items */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/10">
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    </div>
                    <CardTitle className="text-2xl">Work Items</CardTitle>
                  </div>
                  {selectedPM && (
                    <Button
                      onClick={() => setShowAddWork(!showAddWork)}
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {selectedPM ? 'Track your tasks' : 'Select a PM to view work'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {showAddWork && selectedPM && (
                  <div className="space-y-3 p-4 rounded-lg bg-teal-50/50 border border-teal-200/50">
                    <Input
                      placeholder="Task title *"
                      value={workForm.title}
                      onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                    />
                    <Input
                      placeholder="Description"
                      value={workForm.description}
                      onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                    />
                    <select
                      value={workForm.status}
                      onChange={(e) => setWorkForm({ ...workForm, status: e.target.value as Work['status'] })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="flex gap-2">
                      <Button onClick={addWork} className="flex-1 bg-teal-600 hover:bg-teal-700">
                        Add Work
                      </Button>
                      <Button onClick={() => setShowAddWork(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {!selectedPM && (
                  <p className="text-center text-muted-foreground py-12">
                    Select a project manager to view their work items
                  </p>
                )}
                
                {selectedPM && work.length === 0 && !showAddWork && (
                  <p className="text-center text-muted-foreground py-8">No work items yet</p>
                )}
                
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {work.map((item, index) => (
                    <div
                      key={item._id}
                      className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold">{item.title}</div>
                        <button
                          onClick={() => deleteWork(item._id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      )}
                      <select
                        value={item.status}
                        onChange={(e) => updateWorkStatus(item._id, e.target.value as Work['status'])}
                        className="text-xs px-2 py-1 rounded border bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Jobs */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/10">
                      <Briefcase className="w-5 h-5 text-pink-600" />
                    </div>
                    <CardTitle className="text-2xl">Jobs</CardTitle>
                  </div>
                  {selectedPM && (
                    <Button
                      onClick={() => setShowAddJob(!showAddJob)}
                      size="sm"
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {selectedPM ? 'Active projects' : 'Select a PM to view jobs'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {showAddJob && selectedPM && (
                  <div className="space-y-3 p-4 rounded-lg bg-pink-50/50 border border-pink-200/50">
                    <Input
                      placeholder="Job title *"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    />
                    <Input
                      placeholder="Description"
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    />
                    <Input
                      placeholder="Budget"
                      type="number"
                      value={jobForm.budget}
                      onChange={(e) => setJobForm({ ...jobForm, budget: e.target.value })}
                    />
                    <select
                      value={jobForm.status}
                      onChange={(e) => setJobForm({ ...jobForm, status: e.target.value as Job['status'] })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="flex gap-2">
                      <Button onClick={addJob} className="flex-1 bg-pink-600 hover:bg-pink-700">
                        Add Job
                      </Button>
                      <Button onClick={() => setShowAddJob(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {!selectedPM && (
                  <p className="text-center text-muted-foreground py-12">
                    Select a project manager to view their jobs
                  </p>
                )}
                
                {selectedPM && jobs.length === 0 && !showAddJob && (
                  <p className="text-center text-muted-foreground py-8">No jobs yet</p>
                )}
                
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {jobs.map((job, index) => (
                    <div
                      key={job._id}
                      className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold">{job.title}</div>
                        <button
                          onClick={() => deleteJob(job._id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                      {job.description && (
                        <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
                      )}
                      {job.budget && (
                        <p className="text-sm font-mono text-green-600 mb-2">
                          ${job.budget.toLocaleString()}
                        </p>
                      )}
                      <select
                        value={job.status}
                        onChange={(e) => updateJobStatus(job._id, e.target.value as Job['status'])}
                        className="text-xs px-2 py-1 rounded border bg-white"
                      >
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
