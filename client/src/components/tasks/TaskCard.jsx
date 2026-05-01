import React from 'react';
import { Edit3, Trash2, Calendar, User, AlertTriangle } from 'lucide-react';
import { format, isPast } from 'date-fns';

const PRIORITY_COLORS = { low: 'var(--green)', medium: 'var(--yellow)', high: 'var(--orange)', critical: 'var(--red)' };
const STATUSES = ['todo', 'in-progress', 'review', 'done'];

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, listView }) {
  const isOverdue = task.dueDate && task.status !== 'done' && isPast(new Date(task.dueDate));

  if (listView) {
    return (
      <div className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 4, height: 36, borderRadius: 99, background: PRIORITY_COLORS[task.priority], flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.project?.name}</div>
        </div>
        {task.assignedTo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>
              {task.assignedTo.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ whiteSpace: 'nowrap' }}>{task.assignedTo.name}</span>
          </div>
        )}
        <select value={task.status} onChange={e => onStatusChange(task._id, e.target.value)} style={{ width: 130, fontSize: '0.8rem', height: 32 }}>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
        </select>
        <span className={`badge priority-${task.priority}`}>{task.priority}</span>
        {isOverdue && <AlertTriangle size={14} color="var(--red)" />}
        {task.dueDate && <span style={{ fontSize: '0.72rem', color: isOverdue ? 'var(--red)' : 'var(--text-dim)', whiteSpace: 'nowrap' }}>{format(new Date(task.dueDate), 'MMM d')}</span>}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={onEdit} style={{ padding: 6 }}><Edit3 size={13} /></button>
          <button className="btn btn-ghost btn-sm" onClick={onDelete} style={{ padding: 6, color: 'var(--red)' }}><Trash2 size={13} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <span className={`badge priority-${task.priority}`}>{task.priority}</span>
            {isOverdue && <span style={{ fontSize: '0.7rem', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 2 }}><AlertTriangle size={11} /> Overdue</span>}
          </div>
          <div style={{ fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.4 }}>{task.title}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
          <button className="btn btn-ghost btn-sm" onClick={onEdit} style={{ padding: 5 }}><Edit3 size={13} /></button>
          <button className="btn btn-ghost btn-sm" onClick={onDelete} style={{ padding: 5, color: 'var(--red)' }}><Trash2 size={13} /></button>
        </div>
      </div>

      {task.description && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </p>
      )}

      {task.project?.name && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', background: 'var(--bg-3)', borderRadius: 4, padding: '2px 6px', display: 'inline-block', alignSelf: 'flex-start' }}>
          {task.project.name}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
        {task.assignedTo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#fff' }}>
              {task.assignedTo.name?.[0]?.toUpperCase()}
            </div>
            {task.assignedTo.name}
          </div>
        ) : (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 3 }}><User size={11} />Unassigned</span>
        )}
        {task.dueDate && (
          <span style={{ fontSize: '0.72rem', color: isOverdue ? 'var(--red)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Calendar size={11} />{format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>

      <select value={task.status} onChange={e => onStatusChange(task._id, e.target.value)} style={{ fontSize: '0.78rem', height: 30, borderRadius: 6 }}>
        {STATUSES.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
      </select>
    </div>
  );
}
