'use client';

import { useState, useEffect } from 'react';
import { Plus, Briefcase, CheckCircle2, Clock, XCircle, Users, Pencil, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ProjectManager {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
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
  date?: string;
  createdAt?: string;
}

export default function Home() {
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([]);
  const [selectedPM, setSelectedPM] = useState<string | null>(null);
  const [work, setWork] = useState<Work[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAddPM, setShowAddPM] = useState(false);
  const [editingPMId, setEditingPMId] = useState<string | null>(null);
  const [showAddWork, setShowAddWork] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Form states
  const [pmForm, setPMForm] = useState({ name: '', email: '', phone: '' });
  const [editPMForm, setEditPMForm] = useState({ name: '', email: '', phone: '' });
  const [editWorkForm, setEditWorkForm] = useState<{ title: string; description: string; status: 'pending' | 'in-progress' | 'completed' }>({
    title: '',
    description: '',
    status: 'pending',
  });
  const [workForm, setWorkForm] = useState<{ title: string; description: string; status: 'pending' | 'in-progress' | 'completed' }>({ title: '', description: '', status: 'pending' });
  const [editJobForm, setEditJobForm] = useState<{ title: string; description: string; status: 'active' | 'on-hold' | 'completed' | 'cancelled'; date: string }>({
    title: '',
    description: '',
    status: 'active',
    date: '',
  });
  const [jobForm, setJobForm] = useState<{ title: string; description: string; status: 'active' | 'on-hold' | 'completed' | 'cancelled'; date: string }>({ title: '', description: '', status: 'active', date: '' });

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
      setPMForm({ name: '', email: '', phone: '' });
      setShowAddPM(false);
    }
  };

  const startEditProjectManager = (pm: ProjectManager) => {
    setEditingPMId(pm._id);
    setEditPMForm({
      name: pm.name,
      email: pm.email || '',
      phone: pm.phone || '',
    });
  };

  const cancelEditProjectManager = () => {
    setEditingPMId(null);
    setEditPMForm({ name: '', email: '', phone: '' });
  };

  const updateProjectManager = async () => {
    if (!editingPMId || !editPMForm.name) return;
    const res = await fetch(`/api/project-managers/${editingPMId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editPMForm),
    });
    const data = await res.json();
    if (data.success) {
      setProjectManagers(
        projectManagers.map(pm => pm._id === editingPMId ? data.data : pm)
      );
      cancelEditProjectManager();
    }
  };

  const deleteProjectManager = async (pmId: string) => {
    const confirmed = window.confirm('Delete this project manager? This cannot be undone.');
    if (!confirmed) return;
    await fetch(`/api/project-managers/${pmId}`, { method: 'DELETE' });
    setProjectManagers(projectManagers.filter(pm => pm._id !== pmId));
    if (selectedPM === pmId) {
      setSelectedPM(null);
      setWork([]);
      setJobs([]);
    }
    if (editingPMId === pmId) {
      cancelEditProjectManager();
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
        date: jobForm.date || undefined,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setJobs([data.data, ...jobs]);
      setJobForm({ title: '', description: '', status: 'active', date: '' });
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

  const startEditWork = (item: Work) => {
    setEditingWorkId(item._id);
    setEditWorkForm({
      title: item.title,
      description: item.description || '',
      status: item.status,
    });
  };

  const cancelEditWork = () => {
    setEditingWorkId(null);
    setEditWorkForm({ title: '', description: '', status: 'pending' });
  };

  const updateWorkItem = async () => {
    if (!editingWorkId || !editWorkForm.title) return;
    const res = await fetch(`/api/work/${editingWorkId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editWorkForm),
    });
    const data = await res.json();
    if (data.success) {
      setWork(work.map(item => item._id === editingWorkId ? data.data : item));
      cancelEditWork();
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

  const startEditJob = (job: Job) => {
    setEditingJobId(job._id);
    setEditJobForm({
      title: job.title,
      description: job.description || '',
      status: job.status,
      date: getJobDateValue(job),
    });
  };

  const cancelEditJob = () => {
    setEditingJobId(null);
    setEditJobForm({ title: '', description: '', status: 'active', date: '' });
  };

  const updateJobItem = async () => {
    if (!editingJobId || !editJobForm.title) return;
    const res = await fetch(`/api/jobs/${editingJobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editJobForm,
        date: editJobForm.date || undefined,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setJobs(jobs.map(job => job._id === editingJobId ? data.data : job));
      cancelEditJob();
    }
  };

  const deleteWork = async (workId: string) => {
    await fetch(`/api/work/${workId}`, { method: 'DELETE' });
    setWork(work.filter(w => w._id !== workId));
    if (editingWorkId === workId) {
      cancelEditWork();
    }
  };

  const deleteJob = async (jobId: string) => {
    await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    setJobs(jobs.filter(j => j._id !== jobId));
    if (editingJobId === jobId) {
      cancelEditJob();
    }
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

  const getProjectManagerName = (pmId: string) => {
    return projectManagers.find(pm => pm._id === pmId)?.name || 'Unknown PM';
  };

  const formatJobDate = (date?: string) => {
    return date ? new Date(date).toLocaleDateString() : '';
  };

  const getJobDateValue = (job: Job) => {
    return job.date ? job.date.slice(0, 10) : job.createdAt ? job.createdAt.slice(0, 10) : '';
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    let y = 16;

    const addHeading = (text: string) => {
      doc.setFontSize(14);
      doc.text(text, 14, y);
      y += 8;
      doc.setFontSize(11);
    };

    const addLine = (text: string) => {
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 14, y);
      y += lines.length * 6;
      if (y > 270) {
        doc.addPage();
        y = 16;
      }
    };

    doc.setFontSize(16);
    doc.text('PM Tracker Report', 14, y);
    y += 10;
    doc.setFontSize(11);
    addLine(`Generated: ${new Date().toLocaleString()}`);

    addHeading('Project Managers');
    if (projectManagers.length === 0) {
      addLine('No project managers.');
    } else {
      projectManagers.forEach(pm => {
        doc.setFont(undefined, 'bold');
        addLine(`• ${pm.name}`);
        doc.setFont(undefined, 'normal');
        if (pm.phone) addLine(`  Phone: ${pm.phone}`);
        if (pm.email) addLine(`  Email: ${pm.email}`);

        const pmWork = work.filter(item => item.projectManagerId === pm._id);
        const pmJobs = jobs.filter(job => job.projectManagerId === pm._id);

        addLine('  Jobs:');
        if (pmJobs.length === 0) {
          addLine('    None');
        } else {
          pmJobs.forEach(job => {
            const jobDate = job.date || job.createdAt;
            const dateLabel = jobDate ? ` - ${formatJobDate(jobDate)}` : '';
            addLine(`    - ${job.title} (${job.status})${dateLabel}`);
            if (job.description) addLine(`      ${job.description}`);
          });
        }

        // Work items intentionally omitted from PDF export.
      });
    }

    doc.save('pm-tracker-report.pdf');
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    }}>
      <div className="container mx-auto p-8">
        <div className="mb-12 animate-fade-in flex items-start justify-between gap-4">
          <div>
            <h1 className="text-6xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
              PM Tracker
            </h1>
            <p className="text-white/80 text-lg" style={{ fontFamily: "'Space Mono', monospace" }}>
              Manage your work across project managers
            </p>
          </div>
          <Button
            onClick={exportToPdf}
            className="bg-white text-purple-700 hover:bg-white/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
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
                      placeholder="Phone"
                      value={pmForm.phone}
                      onChange={(e) => setPMForm({ ...pmForm, phone: e.target.value })}
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
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-lg">{pm.name}</div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditProjectManager(pm);
                          }}
                          className={`p-1 rounded-md transition-colors ${
                            selectedPM === pm._id ? 'hover:bg-white/20' : 'hover:bg-gray-200'
                          }`}
                          aria-label="Edit project manager"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProjectManager(pm._id);
                          }}
                          className={`p-1 rounded-md transition-colors ${
                            selectedPM === pm._id ? 'hover:bg-white/20' : 'hover:bg-gray-200'
                          }`}
                          aria-label="Delete project manager"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {editingPMId === pm._id ? (
                      <div
                        className={`mt-3 space-y-2 ${
                          selectedPM === pm._id ? 'text-white' : 'text-foreground'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          placeholder="Name *"
                          value={editPMForm.name}
                          onChange={(e) => setEditPMForm({ ...editPMForm, name: e.target.value })}
                          className={selectedPM === pm._id ? 'bg-white/90 text-gray-900 placeholder:text-gray-500' : undefined}
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={editPMForm.email}
                          onChange={(e) => setEditPMForm({ ...editPMForm, email: e.target.value })}
                          className={selectedPM === pm._id ? 'bg-white/90 text-gray-900 placeholder:text-gray-500' : undefined}
                        />
                        <Input
                          placeholder="Phone"
                          value={editPMForm.phone}
                          onChange={(e) => setEditPMForm({ ...editPMForm, phone: e.target.value })}
                          className={selectedPM === pm._id ? 'bg-white/90 text-gray-900 placeholder:text-gray-500' : undefined}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateProjectManager();
                            }}
                            className="flex-1 bg-white text-purple-700 border border-white/70 hover:bg-white/90"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditProjectManager();
                            }}
                            variant="outline"
                            className="flex-1 border-white/40 text-purple-700 hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {pm.phone && (
                          <div className={`text-sm mt-1 ${selectedPM === pm._id ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {pm.phone}
                          </div>
                        )}
                        {pm.email && (
                          <div className={`text-xs mt-1 font-mono ${selectedPM === pm._id ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {pm.email}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Work & Jobs Columns */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="Date"
                      type="date"
                      value={jobForm.date}
                      onChange={(e) => setJobForm({ ...jobForm, date: e.target.value })}
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditJob(job)}
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 transition-opacity"
                            aria-label="Edit job"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteJob(job._id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                            aria-label="Delete job"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {editingJobId === job._id ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Job title *"
                            value={editJobForm.title}
                            onChange={(e) => setEditJobForm({ ...editJobForm, title: e.target.value })}
                          />
                          <Input
                            placeholder="Description"
                            value={editJobForm.description}
                            onChange={(e) => setEditJobForm({ ...editJobForm, description: e.target.value })}
                          />
                          <Input
                            placeholder="Date"
                            type="date"
                            value={editJobForm.date}
                            onChange={(e) => setEditJobForm({ ...editJobForm, date: e.target.value })}
                          />
                          <select
                            value={editJobForm.status}
                            onChange={(e) => setEditJobForm({ ...editJobForm, status: e.target.value as Job['status'] })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value="active">Active</option>
                            <option value="on-hold">On Hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <div className="flex gap-2">
                            <Button onClick={updateJobItem} className="flex-1 bg-pink-600 hover:bg-pink-700">
                              Save
                            </Button>
                            <Button onClick={cancelEditJob} variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {job.description && (
                            <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
                          )}
                          {Boolean(job.date || job.createdAt) && (
                            <p className="text-sm font-mono text-green-600 mb-2">
                              {formatJobDate(job.date || job.createdAt)}
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
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {getProjectManagerName(item.projectManagerId)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditWork(item)}
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 transition-opacity"
                            aria-label="Edit work item"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteWork(item._id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                            aria-label="Delete work item"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {editingWorkId === item._id ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Task title *"
                            value={editWorkForm.title}
                            onChange={(e) => setEditWorkForm({ ...editWorkForm, title: e.target.value })}
                          />
                          <Input
                            placeholder="Description"
                            value={editWorkForm.description}
                            onChange={(e) => setEditWorkForm({ ...editWorkForm, description: e.target.value })}
                          />
                          <select
                            value={editWorkForm.status}
                            onChange={(e) => setEditWorkForm({ ...editWorkForm, status: e.target.value as Work['status'] })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <div className="flex gap-2">
                            <Button onClick={updateWorkItem} className="flex-1 bg-teal-600 hover:bg-teal-700">
                              Save
                            </Button>
                            <Button onClick={cancelEditWork} variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
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
