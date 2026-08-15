import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  ArrowLeft, CalendarDays, Check, ChevronRight, CircleDollarSign, Download,
  Eye, FileText, LayoutDashboard, LogOut, MapPinned, Menu, Plus, Search,
  ShieldCheck, Upload, Users, X,
} from 'lucide-react'
import './App.css'

type Role = 'admin' | 'customer'
type View = 'overview' | 'documents' | 'schedule' | 'pricing' | 'guide'
type Currency = 'KZT' | 'USD' | 'EUR' | 'RUB'
type DocumentItem = {
  id: number;
  name: string;
  category: 'Required' | 'Travel';
  status: 'Missing' | 'Uploaded' | 'Approved';
  fileName?: string;
  dataUrl?: string;
  uploadedAt?: string
}
type ScheduleItem = {
  id: number;
  date: string;
  time: string;
  title: string;
  location: string
}
type ServiceItem = {
  id: number;
  name: string;
  price: number
}
type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  visaType: string;

  requestType: string;
  email: string;
  password: string;
  currency: Currency;

  progress: number;
  documents: DocumentItem[];
  schedule: ScheduleItem[];
  services: ServiceItem[]
}

const initialCustomers: Customer[] = [
  {
    id: 1, firstName: 'Elena', lastName: 'Volkova', dob: '1992-04-18',
    visaType: 'Digital Nomad Visa', requestType: 'Relocation assistance',
    email: 'elena@example.com', password: 'welcome123', currency: 'EUR', progress: 68,
    documents: [
      { id: 1, name: 'Passport scan', category: 'Required', status: 'Approved', fileName: 'passport-elena.pdf', uploadedAt: 'Aug 8, 2026' },
      { id: 2, name: 'Proof of income', category: 'Required', status: 'Uploaded', fileName: 'income-statement.pdf', uploadedAt: 'Aug 10, 2026' },
      { id: 3, name: 'Passport photo', category: 'Required', status: 'Missing' },
      { id: 4, name: 'Flight ticket', category: 'Travel', status: 'Missing' },
      { id: 5, name: 'Hotel booking', category: 'Travel', status: 'Missing' },
    ],
    schedule: [
      { id: 1, date: '2026-08-12', time: '12:00', title: 'Migration Service appointment', location: 'Public Service Centre, Astana' },
      { id: 2, date: '2026-08-12', time: '13:00', title: 'Bank appointment', location: 'Halyk Bank, Mangilik El Avenue' },
      { id: 3, date: '2026-08-12', time: '14:00', title: 'Welcome lunch', location: 'Qazaq Gourmet, Astana' },
      { id: 4, date: '2026-08-13', time: '10:00', title: 'Bank follow-up', location: 'Halyk Bank, Mangilik El Avenue' },
      { id: 5, date: '2026-08-13', time: '11:00', title: 'Accountant consultation', location: 'Esil District office' },
    ],
    services: [
      { id: 1, name: 'Passport preparation', price: 180000 },
      { id: 2, name: 'Fingerprint preparation', price: 90000 },
      { id: 3, name: 'Bank account assistance', price: 250000 },
      { id: 4, name: 'Airport transfer', price: 75000 },
    ],
  },
  {
    id: 2, firstName: 'Daniel', lastName: 'Meyer', dob: '1988-11-02', visaType: 'Work Visa',
    requestType: 'Company formation', email: 'daniel@example.com', password: 'welcome123', currency: 'USD', progress: 42,
    documents: [
      { id: 1, name: 'Passport scan', category: 'Required', status: 'Uploaded', fileName: 'passport-daniel.jpg', uploadedAt: 'Aug 9, 2026' },
      { id: 2, name: 'Employment contract', category: 'Required', status: 'Missing' },
      { id: 3, name: 'Flight ticket', category: 'Travel', status: 'Missing' },
      { id: 4, name: 'Hotel booking', category: 'Travel', status: 'Missing' },
    ],
    schedule: [{ id: 1, date: '2026-08-14', time: '11:30', title: 'Legal consultation', location: 'Saryarka District office' }],
    services: [{ id: 1, name: 'Company registration', price: 650000 }, { id: 2, name: 'Airport transfer', price: 75000 }],
  },
  {
    id: 3, firstName: 'Sofia', lastName: 'Petrova', dob: '1995-07-21', visaType: 'Residence Permit',
    requestType: 'Full service package', email: 'sofia@example.com', password: 'welcome123', currency: 'RUB', progress: 84,
    documents: [
      { id: 1, name: 'Passport scan', category: 'Required', status: 'Approved', fileName: 'passport-sofia.pdf' },
      { id: 2, name: 'Birth certificate', category: 'Required', status: 'Approved', fileName: 'birth-certificate.pdf' },
      { id: 3, name: 'Flight ticket', category: 'Travel', status: 'Uploaded', fileName: 'flight-ticket.pdf' },
      { id: 4, name: 'Hotel booking', category: 'Travel', status: 'Missing' },
    ],
    schedule: [{ id: 1, date: '2026-08-15', time: '09:30', title: 'Residence application', location: 'Public Service Centre, Astana' }],
    services: [{ id: 1, name: 'Residence permit preparation', price: 480000 }],
  },
]

const guideItems = [
  { type: 'Area', name: 'Esil District', note: 'Modern architecture, riverside walks and central city life', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80' },
  { type: 'Restaurant', name: 'Qazaq Gourmet', note: 'Contemporary Kazakh cuisine with traditional hospitality', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80' },
  { type: 'Attraction', name: 'Baiterek Monument', note: 'Astana’s landmark observation tower and city panorama', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80' },
]
const serviceOptions = ['Passport preparation', 'Fingerprint preparation', 'Bank account assistance', 'Airport transfer', 'Salon appointment', 'Translation service', 'Company registration']
const rates: Record<Currency, number> = { KZT: 1, USD: 0.002, EUR: 0.0018, RUB: 0.16 }
const currencySymbols: Record<Currency, string> = { KZT: '₸', USD: '$', EUR: '€', RUB: '₽' }

function App() {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('aziza-customers')
    return saved ? JSON.parse(saved) : initialCustomers
  })
  const [session, setSession] = useState<{ role: Role; customerId?: number } | null>(null)
  const [selectedId, setSelectedId] = useState(2)
  const [view, setView] = useState<View>('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)

  useEffect(() => localStorage.setItem('aziza-customers', JSON.stringify(customers)), [customers])
  const activeId = session?.role === 'customer' ? session.customerId! : selectedId
  const customer = customers.find((item) => item.id === activeId) ?? customers[0]
  const updateCustomer = (next: Customer) => setCustomers((current) => current.map((item) => item.id === next.id ? next : item))

  if (!session) return <Login customers={customers} onLogin={setSession} />
  const isAdmin = session.role === 'admin'
  const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'pricing', label: 'Services & pricing', icon: CircleDollarSign },
    { id: 'guide', label: 'Local guide', icon: MapPinned },
  ]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div className="brand"><span>A</span><div>AZIZA<small>Astana concierge</small></div></div>
        <button className="mobile-close icon-button" onClick={() => setMobileNav(false)} aria-label="Close menu"><X /></button>
        <div className="role-label">{isAdmin ? 'Administration' : 'My journey'}</div>
        <nav>
          {isAdmin && <button className={view === 'overview' ? 'active' : ''} onClick={() => { setView('overview'); setMobileNav(false) }}><Users />Customers</button>}
          {!isAdmin && navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => { setView(id); setMobileNav(false) }}><Icon />{label}</button>)}
          {isAdmin && navItems.slice(1).map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => { setView(id); setMobileNav(false) }}><Icon />{label}</button>)}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{isAdmin ? 'AV' : `${customer.firstName[0]}${customer.lastName[0]}`}</div>
          <div><strong>{isAdmin ? 'Aziza V.' : `${customer.firstName} ${customer.lastName}`}</strong><small>{isAdmin ? 'Administrator' : 'Customer portal'}</small></div>
          <button className="icon-button" onClick={() => setSession(null)} aria-label="Sign out" title="Sign out"><LogOut /></button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu /></button>
          <div><p>{isAdmin ? 'Customer management' : 'Welcome back'}</p><h1>{isAdmin && view === 'overview' ? 'Customers' : `${customer.firstName} ${customer.lastName}`}</h1></div>
          <div className="topbar-actions"><span className="secure"><ShieldCheck /> Secure portal</span>{isAdmin && view === 'overview' && <button className="primary" onClick={() => setShowAddCustomer(true)}><Plus />Add customer</button>}</div>
        </header>

        <div className="content">
          {
            isAdmin && view === 'overview'
              ? <Customers customers={customers} onOpen={(id) => { setSelectedId(id); setView('documents') }} />
              : <>
                {isAdmin && <button className="back-link" onClick={() => setView('overview')}><ArrowLeft />All customers</button>}
                <ProfileStrip customer={customer} />
                {view === 'overview' && <CustomerOverview customer={customer} onNavigate={setView} />}
                {view === 'documents' && <Documents customer={customer} isAdmin={isAdmin} onChange={updateCustomer} />}
                {view === 'schedule' && <Schedule customer={customer} isAdmin={isAdmin} onChange={updateCustomer} />}
                {view === 'pricing' && <Pricing customer={customer} isAdmin={isAdmin} onChange={updateCustomer} />}
                {view === 'guide' && <Guide />}
              </>
          }
        </div>
      </main>
      {showAddCustomer && <AddCustomer onClose={() => setShowAddCustomer(false)} onAdd={(newCustomer) => { setCustomers((current) => [...current, newCustomer]); setShowAddCustomer(false) }} nextId={Math.max(...customers.map((item) => item.id)) + 1} />}
    </div>
  )
}

function Login({ customers, onLogin }: { customers: Customer[]; onLogin: (session: { role: Role; customerId?: number }) => void }) {
  const [role, setRole] = useState<Role>('customer')
  const [email, setEmail] = useState('elena@example.com')
  const [password, setPassword] = useState('welcome123')
  const [error, setError] = useState('')
  function switchRole(next: Role) {
    setRole(next);
    setEmail(next === 'admin' ? 'admin@aziza.kz' : 'elena@example.com')
    setPassword(next === 'admin' ? 'admin123' : 'welcome123'); setError('')
  }
  function submit(event: FormEvent) {
    event.preventDefault()
    if (role === 'admin' && email === 'admin@aziza.kz' && password === 'admin123') return onLogin({ role })
    const customer = customers.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
    if (role === 'customer' && customer) return onLogin({ role, customerId: customer.id })
    setError('Email or password is incorrect.')
  }
  return <div className="login-page">
    <section className="login-scene">
      <div className="scene-brand"><span>A</span> AZIZA</div><div className="scene-copy"><p>YOUR ARRIVAL, THOUGHTFULLY PLANNED</p><h1>Settle into Astana with confidence.</h1><span>Documents, appointments and local guidance for your move to Kazakhstan.</span></div><div className="scene-credit">Astana, Kazakhstan</div>
    </section>
    <section className="login-panel">
      <div className="login-box"><div className="eyebrow">SECURE CLIENT PORTAL</div><h2>Welcome to Aziza</h2><p>Sign in to continue your relocation journey.</p>
        <div className="role-switch">
          <button className={role === 'customer' ? 'active' : ''} onClick={() => switchRole('customer')}>Customer</button>
          <button className={role === 'admin' ? 'active' : ''} onClick={() => switchRole('admin')}>Administrator</button>
        </div>
        <form onSubmit={submit}>
          <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary login-submit" type="submit">Sign in <ChevronRight /></button>
        </form>
        <div className="demo-note">Demo credentials are prefilled for each role.</div>
      </div>
    </section>
  </div>
}

function Customers({ customers, onOpen }: { customers: Customer[]; onOpen: (id: number) => void }) {
  const [query, setQuery] = useState('')
  const filtered = customers.filter((item) => `${item.firstName} ${item.lastName} ${item.email}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="panel customer-panel"><div className="panel-head"><div><h2>All customers</h2><p>{customers.length} active customer records</p></div><label className="search"><Search /><input placeholder="Search customers" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div><div className="customer-table">
    <div className="table-row table-heading"><span>Customer</span><span>Visa & request</span><span>Documents</span><span>Progress</span><span></span></div>
    {filtered.map((item) => {
      const uploaded = item.documents.filter((document) => document.status !== 'Missing').length; return <button className="table-row" key={item.id} onClick={() => onOpen(item.id)}>
        <span className="customer-cell"><b className="avatar">{item.firstName[0]}{item.lastName[0]}</b><span><strong>{item.firstName} {item.lastName}</strong><small>{item.email}</small></span></span><span><strong>{item.visaType}</strong><small>{item.requestType}</small></span><span><strong>{uploaded} / {item.documents.length}</strong><small>received</small></span><span className="progress-cell"><span><i style={{ width: `${item.progress}%` }} /></span><small>{item.progress}%</small></span><span><ChevronRight /></span>
      </button>
    })}
  </div></section>
}

function ProfileStrip({ customer }: { customer: Customer }) {
  return (
    <div className="profile-strip">
      <div className="profile-person">
        <div className="avatar large">{customer.firstName[0]}{customer.lastName[0]}
        </div>
        <div>
          <h2>{customer.firstName} {customer.lastName}
          </h2>
          <p>{customer.email}
          </p>
        </div>
      </div>
      <dl>
        <div>
          <dt>Date of birth
          </dt>
          <dd>{new Date(`${customer.dob}T00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </dd>
        </div>
        <div>
          <dt>Visa type
          </dt>
          <dd>{customer.visaType}
          </dd>
        </div>
        <div>
          <dt>Request
          </dt>
          <dd>{customer.requestType}
          </dd>
        </div>
        <div>
          <dt>Overall progress
          </dt>
          <dd>{customer.progress}%
          </dd>
        </div>
      </dl>
    </div>
  )
}

function CustomerOverview({ customer, onNavigate }: { customer: Customer; onNavigate: (view: View) => void }) {
  const next = [...customer.schedule].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0]
  const missing = customer.documents.filter((item) => item.status === 'Missing').length
  return (
    <div className="overview-grid">
      <button className="summary-card" onClick={() => onNavigate('documents')}>
        <FileText />
        <span>
          <small>Documents</small>
          <strong>{missing} still needed</strong>
        </span>
        <ChevronRight />
      </button>
      <button className="summary-card" onClick={() => onNavigate('schedule')}><CalendarDays />
        <span>
          <small>Next appointment</small>
          <strong>{next ? `${formatDate(next.date)}, ${formatTime(next.time)}` : 'Nothing scheduled'}</strong>
        </span>
        <ChevronRight />
      </button>
      <button className="summary-card" onClick={() => onNavigate('pricing')}>
        <CircleDollarSign />
        <span>
          <small>Service estimate</small>
          <strong>₸{customer.services.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</strong>
        </span>
        <ChevronRight />
      </button>
      <section className="panel overview-wide">
        <div className="panel-head">
          <div>
            <h2>Your relocation path</h2>
            <p>Everything your coordinator has prepared.</p>
          </div>
        </div>
        <div className="path-steps">
          <span className="done">
            <Check />Profile created</span>
          <span className="done">
            <Check />Plan confirmed</span>
          <span className="current">3</span>
          <b>Documents & appointments</b>
          <span>4</span>
          <b>Arrival complete</b>
        </div>
      </section>
    </div>
  )
}

function Documents({ customer, isAdmin, onChange }: { customer: Customer; isAdmin: boolean; onChange: (customer: Customer) => void }) {
  const [newName, setNewName] = useState('')
  function upload(documentId: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return
    if (!['application/pdf', 'image/jpeg'].includes(file.type)) return alert('Please choose a PDF, JPEG or JPG file.')
    const reader = new FileReader()
    reader.onload = () => onChange({ ...customer, documents: customer.documents.map((item) => item.id === documentId ? { ...item, status: 'Uploaded', fileName: file.name, dataUrl: String(reader.result), uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : item) })
    reader.readAsDataURL(file)
  }
  function addDocument(event: FormEvent) {
    event.preventDefault(); if (!newName.trim()) return
    onChange({ ...customer, documents: [...customer.documents, { id: Date.now(), name: newName.trim(), category: 'Required', status: 'Missing' }] }); setNewName('')
  }
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Document center</h2>
          <p>PDF, JPEG or JPG files up to your browser storage limit.</p>
        </div>
        {isAdmin &&
          <form className="inline-form" onSubmit={addDocument}>
            <input placeholder="New required document" value={newName} onChange={(event) => setNewName(event.target.value)} />
            <button className="secondary" type="submit"><Plus />Add request</button>
          </form>
        }
      </div>
      <div className="document-list">
        {customer.documents.map((item) =>
          <div className="document-row" key={item.id}>
            <div className={`file-icon ${item.status.toLowerCase()}`}>
              <FileText />
            </div>
            <div className="document-name">
              <strong>{item.name}</strong>
              <small>{item.fileName ?? `${item.category} document`}{item.uploadedAt ? ` · ${item.uploadedAt}` : ''}</small>
            </div>
            <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
            <div className="document-actions">{item.fileName && <a className="icon-button" href={item.dataUrl ?? '#'} download={item.fileName} title="Download"><Download /></a>}
              {
                isAdmin && item.status === 'Uploaded' &&
                <button className="icon-button" title="Approve" onClick={() => onChange({ ...customer, documents: customer.documents.map((document) => document.id === item.id ? { ...document, status: 'Approved' } : document) })}>
                  <Check />
                </button>
              }
              <label className="upload-button">
                <Upload />
                <span>{item.status === 'Missing' ? 'Upload' : 'Replace'}</span>
                <input type="file" accept=".pdf,.jpeg,.jpg,application/pdf,image/jpeg" onChange={(event) => upload(item.id, event)} />
              </label>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Schedule({ customer, isAdmin, onChange }: { customer: Customer; isAdmin: boolean; onChange: (customer: Customer) => void }) {
  const [draft, setDraft] = useState({ date: '2026-08-12', time: '12:00', title: '', location: '' })
  const grouped = customer.schedule.reduce<Record<string, ScheduleItem[]>>((groups, item) => ({ ...groups, [item.date]: [...(groups[item.date] ?? []), item] }), {})
  function add(event: FormEvent) { event.preventDefault(); if (!draft.title) return; onChange({ ...customer, schedule: [...customer.schedule, { id: Date.now(), ...draft }] }); setDraft({ ...draft, title: '', location: '' }) }
  return (
    <div className="two-column">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Journey schedule
            </h2>
            <p>Your appointments and plans, day by day.
            </p>
          </div>
        </div>
        <div className="timeline">{Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, items]) =>
          <div className="timeline-day" key={date}>
            <div className="date-block">
              <strong>{new Date(`${date}T00:00`).toLocaleDateString('en-US', { day: '2-digit' })}
              </strong>
              <span>{new Date(`${date}T00:00`).toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </div>
            <div>{items.sort((a, b) => a.time.localeCompare(b.time)).map((item) =>
              <div className="timeline-item" key={item.id}>
                <time>{formatTime(item.time)}
                </time>
                <span>
                </span>
                <div>
                  <strong>{item.title}
                  </strong>
                  <small>{item.location}
                  </small>
                </div>
              </div>)}
            </div>
          </div>)}
        </div>
      </section>{isAdmin &&
        <section className="panel form-panel">
          <h2>Add to schedule
          </h2>
          <p>New items appear in the customer portal instantly.
          </p>
          <form onSubmit={add}>
            <label>Date
              <input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} required />
            </label>
            <label>Time
              <input type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} required />
            </label>
            <label>Appointment
              <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="e.g. Bank appointment" required />
            </label>
            <label>Location
              <input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} placeholder="Address or meeting place" />
            </label>
            <button className="primary" type="submit">
              <Plus />Add appointment
            </button>
          </form>
        </section>}
    </div>)
}

function Pricing({ customer, isAdmin, onChange }: { customer: Customer; isAdmin: boolean; onChange: (customer: Customer) => void }) {
  const [service, setService] = useState(serviceOptions[0]); const [price, setPrice] = useState('')
  const total = customer.services.reduce((sum, item) => sum + item.price, 0)
  function add(event: FormEvent) {
    event.preventDefault(); if (!price || Number(price) <= 0) return; onChange({ ...customer, services: [...customer.services, { id: Date.now(), name: service, price: Number(price) }] }); setPrice('')
  }
  return (
    <div className="two-column pricing-layout">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Services & pricing
            </h2>
            <p>Base pricing is in Kazakhstan tenge (KZT).
            </p>
          </div>
          <select value={customer.currency} onChange={(event) => onChange({ ...customer, currency: event.target.value as Currency })}>
            <option value="KZT">KZT ₸
            </option>
            <option value="USD">USD $
            </option>
            <option value="EUR">EUR €
            </option>
            <option value="RUB">RUB ₽
            </option>
          </select>
        </div>
        <div className="price-list">{customer.services.map((item) =>
          <div key={item.id}>
            <span>{item.name}
            </span>
            <strong>₸{item.price.toLocaleString()}
            </strong>
            <small>{customer.currency !== 'KZT' ? `≈ ${currencySymbols[customer.currency]}${(item.price * rates[customer.currency]).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ''}
            </small>
          </div>)}
        </div>
        <div className="price-total">
          <span>Total estimate
            <small>Converted at indicative rate
            </small>
          </span>
          <strong>₸{total.toLocaleString()}
            <small>{customer.currency !== 'KZT' ? `≈ ${currencySymbols[customer.currency]}${(total * rates[customer.currency]).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ''}
            </small>
          </strong>
        </div>
      </section>{isAdmin ?
        <section className="panel form-panel">
          <h2>Add service line
          </h2>
          <p>Choose a standard item or type its price.
          </p>
          <form onSubmit={add}>
            <label>Service
              <select value={service} onChange={(event) => setService(event.target.value)}>{serviceOptions.map((item) =>
                <option key={item}>{item}
                </option>)}
              </select>
            </label>
            <label>Price in KZT
              <input type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0" />
            </label>
            <button className="primary" type="submit">
              <Plus />Add to estimate
            </button>
          </form>
        </section> :
        <section className="quote-note">
          <CircleDollarSign />
          <h3>Clear, local pricing
          </h3>
          <p>Your coordinator updates this estimate as services are confirmed. Currency values are indicative.
          </p>
        </section>}
    </div>)
}

function Guide() {
  return (
    <section>
      <div className="section-intro">
        <div>
          <span className="eyebrow">CURATED FOR YOUR STAY
          </span>
          <h2>Make yourself at home in Astana
          </h2>
          <p>Places selected by your local Aziza coordinator.
          </p>
        </div>
      </div>
      <div className="guide-grid">{guideItems.map((item) =>
        <article key={item.name}>
          <img src={item.image} alt={item.name} />
          <div>
            <span>{item.type}
            </span>
            <h3>{item.name}
            </h3>
            <p>{item.note}
            </p>
            <button aria-label={`View ${item.name}`}>
              <Eye />View details
            </button>
          </div>
        </article>)}
      </div>
    </section>)
}

function AddCustomer({ onClose, onAdd, nextId }: { onClose: () => void; onAdd: (customer: Customer) => void; nextId: number }) {
  const [draft, setDraft] = useState({ firstName: '', lastName: '', dob: '', visaType: 'Digital Nomad Visa', requestType: 'Relocation assistance', email: '', password: 'welcome123', currency: 'KZT' as Currency })
  function submit(event: FormEvent) { event.preventDefault(); onAdd({ ...draft, id: nextId, progress: 10, documents: [{ id: 1, name: 'Passport scan', category: 'Required', status: 'Missing' }, { id: 2, name: 'Flight ticket', category: 'Travel', status: 'Missing' }, { id: 3, name: 'Hotel booking', category: 'Travel', status: 'Missing' }], schedule: [], services: [] }) }
  return (
    <div className="modal-backdrop">
      <section className="modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">NEW CUSTOMER
            </span>
            <h2>Create portal access
            </h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X />
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>First name
              <input value={draft.firstName} onChange={(event) => setDraft({ ...draft, firstName: event.target.value })} required />
            </label>
            <label>Last name
              <input value={draft.lastName} onChange={(event) => setDraft({ ...draft, lastName: event.target.value })} required />
            </label>
            <label>Date of birth
              <input type="date" value={draft.dob} onChange={(event) => setDraft({ ...draft, dob: event.target.value })} required />
            </label>
            <label>Visa type
              <select value={draft.visaType} onChange={(event) => setDraft({ ...draft, visaType: event.target.value })}>
                <option>Digital Nomad Visa</option>
                <option>Work Visa</option>
                <option>Residence Permit</option>
                <option>Tourist Visa</option>
              </select>
            </label>
            <label>Request type<input value={draft.requestType} onChange={(event) => setDraft({ ...draft, requestType: event.target.value })} required /></label>
            <label>Preferred currency<select value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value as Currency })}>
              <option>KZT</option>
              <option>USD</option>
              <option>EUR</option>
              <option>RUB</option>
            </select>
            </label>
            <label>Email / login<input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} required /></label>
            <label>Temporary password<input value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} required /></label>
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
            <button className="primary" type="submit">Create customer</button>
          </div>
        </form>
      </section>
    </div>
  )
}

function formatDate(date: string) { return new Date(`${date}T00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
function formatTime(time: string) { return new Date(`2026-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }

export default App