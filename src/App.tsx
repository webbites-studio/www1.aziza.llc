import { createContext, useContext, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowLeft, CalendarDays, Check, ChevronRight, CircleDollarSign,
  Eye, FileText, LayoutDashboard, LogOut, MapPinned, Menu, Plus, Search,
  ShieldCheck, Users, X,
} from 'lucide-react'
import './App.css'

type Role = 'admin' | 'customer'
type View = 'overview' | 'documents' | 'schedule' | 'pricing' | 'guide'
type Currency = 'KZT' | 'USD' | 'EUR' | 'RUB'
type Language = 'en' | 'ru' | 'kk'

const translations: Record<Language, Record<string, string>> = {
  en: {},
  ru: {
    'Administration': 'Администрирование', 'My journey': 'Мой путь', Customers: 'Клиенты', Overview: 'Обзор', Documents: 'Документы', Schedule: 'Расписание', 'Services & pricing': 'Услуги и цены', 'Local guide': 'Гид по городу', 'Customer management': 'Управление клиентами', 'Welcome back': 'С возвращением', 'Secure portal': 'Защищенный портал', 'Add customer': 'Добавить клиента', 'All customers': 'Все клиенты', 'Document center': 'Центр документов', 'Journey schedule': 'Расписание поездки', 'All customer schedules': 'Расписание всех клиентов', 'Make yourself at home in Astana': 'Чувствуйте себя как дома в Астане', 'Welcome to Astana': 'Добро пожаловать в Астану', 'Sign in to continue your relocation journey.': 'Войдите, чтобы продолжить поездку.', 'Sign in': 'Войти', Customer: 'Клиент', Administrator: 'Администратор', Password: 'Пароль', 'Login or username': 'Логин или имя пользователя', 'Create portal access': 'Создать доступ к порталу', 'Amount due': 'Сумма к оплате', Paid: 'Оплачено', Arrival: 'Прибытие', Departure: 'Отъезд', 'Previous': 'Назад', Next: 'Далее', Month: 'Месяц', Week: 'Неделя', Day: 'День', 'Visa type': 'Тип визы', Request: 'Запрос', 'Overall progress': 'Общий прогресс'
  },
  kk: {
    'Administration': 'Әкімшілік', 'My journey': 'Менің сапарым', Customers: 'Клиенттер', Overview: 'Шолу', Documents: 'Құжаттар', Schedule: 'Кесте', 'Services & pricing': 'Қызметтер мен бағалар', 'Local guide': 'Қала гиді', 'Customer management': 'Клиенттерді басқару', 'Welcome back': 'Қош келдіңіз', 'Secure portal': 'Қауіпсіз портал', 'Add customer': 'Клиент қосу', 'All customers': 'Барлық клиенттер', 'Document center': 'Құжаттар орталығы', 'Journey schedule': 'Сапар кестесі', 'All customer schedules': 'Барлық клиенттердің кестесі', 'Make yourself at home in Astana': 'Астанада өз үйіңіздегідей болыңыз', 'Welcome to Astana': 'Астанаға қош келдіңіз', 'Sign in to continue your relocation journey.': 'Сапарыңызды жалғастыру үшін кіріңіз.', 'Sign in': 'Кіру', Customer: 'Клиент', Administrator: 'Әкімші', Password: 'Құпиясөз', 'Login or username': 'Логин немесе пайдаланушы аты', 'Create portal access': 'Порталға қолжетімділік жасау', 'Amount due': 'Төленетін сома', Paid: 'Төленді', Arrival: 'Келу', Departure: 'Кету', Previous: 'Алдыңғы', Next: 'Келесі', Month: 'Ай', Week: 'Апта', Day: 'Күн', 'Visa type': 'Виза түрі', Request: 'Сұраныс', 'Overall progress': 'Жалпы барысы'
  },
}

const extraTranslations: Record<Language, Record<string, string>> = {
  en: {},
  ru: {
    'Profile created': 'Профиль создан', 'Plan confirmed': 'План подтвержден', 'Documents & appointments': 'Документы и встречи', 'Arrival complete': 'Прибытие завершено', 'Passport scan': 'Скан паспорта', 'Proof of income': 'Подтверждение дохода', 'Passport photo': 'Фото на паспорт', 'Employment contract': 'Трудовой договор', 'Birth certificate': 'Свидетельство о рождении', 'Flight ticket': 'Авиабилет', 'Hotel booking': 'Бронирование отеля', Missing: 'Отсутствует', Uploaded: 'Получено', Approved: 'Одобрено', 'Migration Service appointment': 'Встреча в миграционной службе', 'Bank appointment': 'Встреча в банке', 'Welcome lunch': 'Приветственный обед', 'Bank follow-up': 'Повторная встреча в банке', 'Accountant consultation': 'Консультация бухгалтера', 'Legal consultation': 'Юридическая консультация', 'Residence application': 'Подача на ВНЖ', 'Airport transfer': 'Трансфер из аэропорта', 'Hotel check-in': 'Заселение в отель', 'Passport preparation': 'Подготовка паспорта', 'Fingerprint preparation': 'Подготовка отпечатков', 'Bank account assistance': 'Помощь с банковским счетом', 'Salon appointment': 'Визит в салон', 'Translation services': 'Услуги перевода', 'BIN number': 'БИН', 'Personal Banking': 'Личный банкинг', 'Business Banking': 'Бизнес-банкинг', 'Phone line': 'Телефонная линия', 'Company registration': 'Регистрация компании', 'Other': 'Другое', 'Travel': 'Путешествие', Required: 'Обязательно', 'Select document': 'Выберите документ', 'Add request': 'Добавить запрос', 'Payment received in KZT': 'Полученный платеж в KZT', 'Save payment': 'Сохранить платеж', 'Paid': 'Оплачено', 'Total estimate': 'Итоговая оценка', 'Your relocation path': 'Ваш путь переезда', 'Nothing scheduled': 'Ничего не запланировано'
  },
  kk: {
    'Profile created': 'Профиль жасалды', 'Plan confirmed': 'Жоспар расталды', 'Documents & appointments': 'Құжаттар мен кездесулер', 'Arrival complete': 'Келу аяқталды', 'Passport scan': 'Паспорт сканы', 'Proof of income': 'Табыс туралы анықтама', 'Passport photo': 'Паспорт суреті', 'Employment contract': 'Еңбек шарты', 'Birth certificate': 'Туу туралы куәлік', 'Flight ticket': 'Әуе билеті', 'Hotel booking': 'Қонақүй брондауы', Missing: 'Жоқ', Uploaded: 'Алынды', Approved: 'Мақұлданды', 'Migration Service appointment': 'Көші-қон қызметіндегі кездесу', 'Bank appointment': 'Банк кездесуі', 'Welcome lunch': 'Қош келдіңіз түскі асы', 'Bank follow-up': 'Банкке қайталама кездесу', 'Accountant consultation': 'Бухгалтер кеңесі', 'Legal consultation': 'Заң кеңесі', 'Residence application': 'Тұруға рұқсат өтініші', 'Airport transfer': 'Әуежай трансфері', 'Hotel check-in': 'Қонақүйге орналасу', 'Passport preparation': 'Паспорт дайындау', 'Fingerprint preparation': 'Саусақ іздерін дайындау', 'Bank account assistance': 'Банк шотына көмек', 'Salon appointment': 'Салонға кездесу', 'Translation services': 'Аударма қызметтері', 'BIN number': 'БСН', 'Personal Banking': 'Жеке банкинг', 'Business Banking': 'Бизнес банкинг', 'Phone line': 'Телефон желісі', 'Company registration': 'Компанияны тіркеу', 'Other': 'Басқа', 'Travel': 'Саяхат', Required: 'Міндетті', 'Select document': 'Құжатты таңдаңыз', 'Add request': 'Сұраныс қосу', 'Payment received in KZT': 'KZT бойынша алынған төлем', 'Save payment': 'Төлемді сақтау', 'Paid': 'Төленді', 'Total estimate': 'Жалпы есеп', 'Your relocation path': 'Сіздің көшу жолыңыз', 'Nothing scheduled': 'Жоспарланбаған'
  },
}
const moreTranslations: Record<Language, Record<string, string>> = {
  en: {},
  ru: { 'Visa & request': 'Виза и запрос', Documents: 'Документы', 'Arrival & departure': 'Прибытие и отъезд', Progress: 'Прогресс', received: 'получено', to: 'до', 'still needed': 'еще требуется', 'Next appointment': 'Следующая встреча', 'Service estimate': 'Оценка услуг', 'Your relocation path': 'Ваш путь переезда', 'Everything your coordinator has prepared.': 'Все, что подготовил ваш координатор.', 'Mark each requested document complete when you are ready.': 'Отметьте документ выполненным, когда будете готовы.', 'Select document': 'Выберите документ', 'Enter document name': 'Введите название документа', 'Review appointments across every customer.': 'Просматривайте встречи всех клиентов.', 'Journey schedule': 'Расписание поездки', 'Your appointments and plans, day by day.': 'Ваши встречи и планы по дням.', 'Add to schedule': 'Добавить в расписание', 'New items appear in the customer portal instantly.': 'Новые записи сразу появятся на портале клиента.', 'Select appointment': 'Выберите встречу', 'Appointment name': 'Название встречи', 'Enter appointment name': 'Введите название встречи', 'Add appointment': 'Добавить встречу', 'Base pricing is in Kazakhstan tenge (KZT).': 'Базовые цены указаны в казахстанских тенге (KZT).', 'Update services and payment': 'Обновить услуги и платеж', 'Add a service or record the amount already paid.': 'Добавьте услугу или укажите уже оплаченную сумму.', Service: 'Услуга', 'Service name': 'Название услуги', 'Price in KZT': 'Цена в KZT', 'Add to estimate': 'Добавить к расчету', 'Payment received in KZT': 'Полученный платеж в KZT', 'Save payment': 'Сохранить платеж', 'Clear, local pricing': 'Понятные местные цены', 'Your coordinator updates this estimate as services are confirmed. Currency values are indicative.': 'Ваш координатор обновляет расчет по мере подтверждения услуг. Значения валют ориентировочные.', 'CURATED FOR YOUR STAY': 'ПОДОБРАНО ДЛЯ ВАШЕГО ПРОЖИВАНИЯ', 'Places selected by your local Aziza coordinator.': 'Места, выбранные вашим местным координатором Aziza.', 'PLACES TO STAY': 'ГДЕ ОСТАНОВИТЬСЯ', 'Hotels for your Astana stay': 'Отели для проживания в Астане', 'FOUR DAYS IN ASTANA': 'ТРИ ДНЯ В АСТАНЕ', 'A considered city itinerary': 'Продуманный маршрут по городу', 'A gentle rhythm of landmarks, local food and time to settle in.': 'Спокойный ритм достопримечательностей, местной кухни и времени для отдыха.', 'View details': 'Подробнее', 'active customer records': 'активных записей клиентов', 'Search customers': 'Поиск клиентов', 'Secure client portal': 'Безопасный портал клиента', 'Demo credentials are prefilled for each role.': 'Данные для демонстрации уже заполнены.' },
  kk: { 'Visa & request': 'Виза және сұраныс', Documents: 'Құжаттар', 'Arrival & departure': 'Келу және кету', Progress: 'Барысы', received: 'алынды', to: 'дейін', 'still needed': 'әлі қажет', 'Next appointment': 'Келесі кездесу', 'Service estimate': 'Қызмет бағасы', 'Everything your coordinator has prepared.': 'Үйлестірушіңіз дайындаған барлық нәрсе.', 'Mark each requested document complete when you are ready.': 'Дайын болған кезде әр құжатты орындалды деп белгілеңіз.', 'Enter document name': 'Құжат атауын енгізіңіз', 'Review appointments across every customer.': 'Барлық клиенттердің кездесулерін қараңыз.', 'Your appointments and plans, day by day.': 'Күн сайынғы кездесулеріңіз бен жоспарларыңыз.', 'Add to schedule': 'Кестеге қосу', 'New items appear in the customer portal instantly.': 'Жаңа жазбалар клиент порталында бірден көрінеді.', 'Select appointment': 'Кездесуді таңдаңыз', 'Appointment name': 'Кездесу атауы', 'Enter appointment name': 'Кездесу атауын енгізіңіз', 'Add appointment': 'Кездесу қосу', 'Base pricing is in Kazakhstan tenge (KZT).': 'Негізгі бағалар Қазақстан теңгесімен (KZT).', 'Update services and payment': 'Қызметтер мен төлемді жаңарту', 'Add a service or record the amount already paid.': 'Қызмет қосыңыз немесе төленген соманы енгізіңіз.', Service: 'Қызмет', 'Service name': 'Қызмет атауы', 'Price in KZT': 'KZT бағасы', 'Add to estimate': 'Есепке қосу', 'Clear, local pricing': 'Түсінікті жергілікті бағалар', 'Your coordinator updates this estimate as services are confirmed. Currency values are indicative.': 'Үйлестірушіңіз қызметтер расталған сайын есепті жаңартады. Валюта мәндері шамамен берілген.', 'Places selected by your local Aziza coordinator.': 'Aziza жергілікті үйлестірушісі таңдаған орындар.', 'Hotels for your Astana stay': 'Астанада тұруға арналған қонақүйлер', 'A considered city itinerary': 'Астана бойынша ойластырылған маршрут', 'A gentle rhythm of landmarks, local food and time to settle in.': 'Көрікті жерлер, жергілікті тағам және демалысқа арналған жайлы ырғақ.', 'View details': 'Толығырақ', 'active customer records': 'белсенді клиент жазбасы', 'Search customers': 'Клиенттерді іздеу', 'Demo credentials are prefilled for each role.': 'Демо деректері алдын ала толтырылған.' },
}
const finalTranslations: Record<Language, Record<string, string>> = {
  en: {},
  ru: { 'Sign out': 'Выйти', 'All customers': 'Все клиенты', 'First name': 'Имя', 'Last name': 'Фамилия', 'Visa type': 'Тип визы', 'Request type': 'Тип запроса', 'Preferred currency': 'Предпочтительная валюта', 'Temporary password': 'Временный пароль', Cancel: 'Отмена', 'Create customer': 'Создать клиента', 'Date': 'Дата', 'Time': 'Время', 'Appointment': 'Встреча', 'Price in KZT': 'Цена в KZT', 'Converted at indicative rate': 'Пересчитано по ориентировочному курсу', 'Clear, local pricing': 'Понятные местные цены', 'Your coordinator updates this estimate as services are confirmed. Currency values are indicative.': 'Ваш координатор обновляет расчет по мере подтверждения услуг. Значения валют ориентировочные.', 'YOUR ARRIVAL, THOUGHTFULLY PLANNED': 'ВАШ ПРИЕЗД, ПРОДУМАННЫЙ ДО МЕЛОЧЕЙ', 'Settle into Astana with confidence.': 'Освойтесь в Астане с уверенностью.', 'Documents, appointments and local guidance for your move to Kazakhstan.': 'Документы, встречи и местные рекомендации для вашего переезда в Казахстан.' },
  kk: { 'Sign out': 'Шығу', 'All customers': 'Барлық клиенттер', 'First name': 'Аты', 'Last name': 'Тегі', 'Visa type': 'Виза түрі', 'Request type': 'Сұраныс түрі', 'Preferred currency': 'Қалаған валюта', 'Temporary password': 'Уақытша құпиясөз', Cancel: 'Болдырмау', 'Create customer': 'Клиент жасау', Date: 'Күні', Time: 'Уақыты', Appointment: 'Кездесу', 'Price in KZT': 'KZT бағасы', 'Converted at indicative rate': 'Шамамен бағаммен есептелген', 'Clear, local pricing': 'Түсінікті жергілікті бағалар', 'Your coordinator updates this estimate as services are confirmed. Currency values are indicative.': 'Қызметтер расталған сайын үйлестіруші есепті жаңартады. Валюта мәндері шамамен берілген.', 'YOUR ARRIVAL, THOUGHTFULLY PLANNED': 'КЕЛУІҢІЗ ОЙЛАСТЫРЫЛҒАН', 'Settle into Astana with confidence.': 'Астанаға сенімді түрде бейімделіңіз.', 'Documents, appointments and local guidance for your move to Kazakhstan.': 'Қазақстанға көшуіңізге арналған құжаттар, кездесулер және жергілікті кеңестер.' },
}
const valueTranslations: Record<Language, Record<string, string>> = {
  en: {},
  ru: { 'Digital Nomad Visa': 'Виза цифрового кочевника', 'Work Visa': 'Рабочая виза', 'Residence Permit': 'Вид на жительство', 'Tourist Visa': 'Туристическая виза', 'Relocation assistance': 'Помощь с переездом', 'Company formation': 'Регистрация компании', 'Full service package': 'Полный пакет услуг' },
  kk: { 'Digital Nomad Visa': 'Цифрлық көшпенді визасы', 'Work Visa': 'Жұмыс визасы', 'Residence Permit': 'Тұруға ықтиярхат', 'Tourist Visa': 'Туристік виза', 'Relocation assistance': 'Көшуге көмек', 'Company formation': 'Компания құру', 'Full service package': 'Толық қызмет пакеті' },
}

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: 'en', setLanguage: () => undefined })
function useLanguage() { const context = useContext(LanguageContext); return { ...context, t: (text: string) => valueTranslations[context.language][text] ?? finalTranslations[context.language][text] ?? moreTranslations[context.language][text] ?? extraTranslations[context.language][text] ?? translations[context.language][text] ?? text } }
function LanguageSelect() {
  const { language, setLanguage } = useLanguage()
  return <label className="language-select"><span>Language</span><select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value as Language)}><option value="en">English</option><option value="ru">Русский</option><option value="kk">Қазақша</option></select></label>
}
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
  services: ServiceItem[];
  arrivalDate?: string;
  departureDate?: string;
  paid?: number
}

const initialCustomers: Customer[] = [
  {
    id: 1, firstName: 'Elena', lastName: 'Volkova', dob: '1992-04-18', arrivalDate: '2026-08-11', departureDate: '2026-08-15',
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
    id: 2, firstName: 'Daniel', lastName: 'Meyer', dob: '1988-11-02', arrivalDate: '2026-08-13', departureDate: '2026-08-16', visaType: 'Work Visa',
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
    id: 3, firstName: 'Sofia', lastName: 'Petrova', dob: '1995-07-21', arrivalDate: '2026-08-14', departureDate: '2026-08-17', visaType: 'Residence Permit',
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

const hotelItems = [
  { type: 'Hotel', name: 'Altyn Eco Park', note: 'A peaceful stay surrounded by green space in Astana', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Trip_to_Astana_%282015-10-24%29_02.jpg/960px-Trip_to_Astana_%282015-10-24%29_02.jpg' },
  { type: 'Hotel', name: 'Sheraton Astana', note: 'A central luxury hotel near the city’s key destinations', image: '/sheraton-astana.jpg', link: 'https://www.marriott.com/en-us/hotels/tsesi-sheraton-astana-hotel/overview/' },
  { type: 'Hotel', name: 'Royal Park Hotel and Spa', note: 'Comfortable rooms and spa facilities for a restorative stay', image: 'https://lh3.googleusercontent.com/sitesv/AG8ngQUb7UyqUdqXdhx4FG1kmeNCdXANU6WDtRNa3N5sphaXxklUFetgc_EvBHP6q0o8WrpB99LL_hums3-2H2s1BJSVxHC422_lFOtIL87TVZBUM-lbKzESPudKqpr4zqXdzFsp87SOo8ZqN6BWUceihAQLlRreexKpRRMCa0j5yFQmV3P57B6KZh4Iq3y3=w1200', link: 'https://sites.google.com/view/royal-park-hotel-spa/' },
]
const serviceOptions = ['Passport preparation', 'Fingerprint preparation', 'Bank account assistance', 'Airport transfer', 'Salon appointment', 'Translation services', 'BIN number', 'Personal Banking', 'Business Banking', 'Phone line', 'Company registration', 'Other']
const appointmentOptions = ['Migration Service appointment', 'Bank appointment', 'Welcome lunch', 'Bank follow-up', 'Accountant consultation', 'Legal consultation', 'Residence application', 'Airport transfer', 'Hotel check-in', 'Other']
const documentOptions = ['Passport scan', 'Proof of income', 'Passport photo', 'Employment contract', 'Birth certificate', 'Flight ticket', 'Hotel booking', 'Other']
const fallbackRates: Record<Currency, number> = { KZT: 1, USD: 0.002, EUR: 0.0018, RUB: 0.16 }
const currencySymbols: Record<Currency, string> = { KZT: '₸', USD: '$', EUR: '€', RUB: '₽' }
const itinerary = [
  { day: 'Day 1', title: 'Discover central Astana', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Trip_to_Astana_%282015-10-24%29_01.jpg/960px-Trip_to_Astana_%282015-10-24%29_01.jpg', stops: ['Check in and settle into your hotel', 'Walk along Nurzhol Boulevard to the Baiterek Monument', 'Enjoy dinner in the Esil District'] },
  { day: 'Day 2', title: 'Culture and city landmarks', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Trip_to_Astana_%282015-10-24%29_02.jpg/960px-Trip_to_Astana_%282015-10-24%29_02.jpg', stops: ['Visit the National Museum of the Republic of Kazakhstan', 'See the Palace of Peace and Reconciliation', 'Take an evening walk around the EXPO 2017 site'] },
  { day: 'Day 3', title: 'Relax, explore and depart', image: 'https://lh3.googleusercontent.com/sitesv/AG8ngQUb7UyqUdqXdhx4FG1kmeNCdXANU6WDtRNa3N5sphaXxklUFetgc_EvBHP6q0o8WrpB99LL_hums3-2H2s1BJSVxHC422_lFOtIL87TVZBUM-lbKzESPudKqpr4zqXdzFsp87SOo8ZqN6BWUceihAQLlRreexKpRRMCa0j5yFQmV3P57B6KZh4Iq3y3=w1200', stops: ['Have a relaxed morning at the hotel or spa', 'Explore the Presidential Park and enjoy a final local meal', 'Pick up gifts before departing Astana or continuing your journey'] },
]
 
function getMonthDates(date: string) {
  const start = new Date(`${date.slice(0, 7)}-01T00:00`)
  const mondayOffset = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - mondayOffset)
  return Array.from({ length: 42 }, (_, index) => formatDateKey(new Date(start.getTime() + index * 86400000)))
}

function getWeekDates(date: string) {
  const start = new Date(`${date}T00:00`)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, index) => formatDateKey(new Date(start.getTime() + index * 86400000)))
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatCalendarDate(date: string, mode: CalendarMode) {
  const calendarDate = new Date(`${date}T00:00`)
  return mode === 'month'
    ? calendarDate.getDate()
    : calendarDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatCalendarPeriod(date: string, mode: CalendarMode) {
  const start = new Date(`${date}T00:00`)
  if (mode === 'month') return start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  if (mode === 'day') return start.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const end = new Date(start.getTime() + 6 * 86400000)
  return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
}

function shiftCalendarDate(date: string, mode: CalendarMode, direction: number) {
  const days = mode === 'month' ? 31 : mode === 'week' ? 7 : 1
  return formatDateKey(new Date(new Date(`${date}T00:00`).getTime() + direction * days * 86400000))
}

function formatTime(time: string) { return new Date(`2026-01-01T${time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) }

function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('aziza-language') as Language) || 'en')
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
  useEffect(() => localStorage.setItem('aziza-language', language), [language])
  const t = (text: string) => finalTranslations[language][text] ?? moreTranslations[language][text] ?? extraTranslations[language][text] ?? translations[language][text] ?? text
  const activeId = session?.role === 'customer' ? session.customerId! : selectedId
  const customer = customers.find((item) => item.id === activeId) ?? customers[0]
  const updateCustomer = (modifiedCustomer: Customer) => setCustomers((existingCustomers) => existingCustomers.map((item) => item.id === modifiedCustomer.id ? modifiedCustomer : item))

  if (!session) return <LanguageContext.Provider value={{ language, setLanguage }}><Login customers={customers} onLogin={setSession} /></LanguageContext.Provider>
  const isAdmin = session.role === 'admin'
  const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'pricing', label: 'Services & pricing', icon: CircleDollarSign },
    { id: 'guide', label: 'Local guide', icon: MapPinned },
  ]

  return <LanguageContext.Provider value={{ language, setLanguage }}>
    <>
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div className="brand"><span>A</span><div>AZIZA<small>Astana concierge</small></div></div>
        <button className="mobile-close icon-button" onClick={() => setMobileNav(false)} aria-label="Close menu"><X /></button>
        <div className="role-label">{t(isAdmin ? 'Administration' : 'My journey')}</div>
        <nav>
          {isAdmin && <button className={view === 'overview' ? 'active' : ''} onClick={() => { setView('overview'); setMobileNav(false) }}><Users />{t('Customers')}</button>}
          {!isAdmin && navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => { setView(id); setMobileNav(false) }}><Icon />{t(label)}</button>)}
          {isAdmin && navItems.slice(1).map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => { setView(id); setMobileNav(false) }}><Icon />{t(label)}</button>)}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{isAdmin ? 'AV' : `${customer.firstName[0]}${customer.lastName[0]}`}</div>
          <div><strong>{isAdmin ? 'Aziza V.' : `${customer.firstName} ${customer.lastName}`}</strong><small>{isAdmin ? 'Administrator' : 'Customer portal'}</small></div>
          <button className="icon-button" onClick={() => setSession(null)} aria-label={t('Sign out')} title={t('Sign out')}><LogOut /></button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu /></button>
          <div><p>{t(isAdmin ? 'Customer management' : 'Welcome back')}</p><h1>{isAdmin && view === 'overview' ? t('Customers') : `${customer.firstName} ${customer.lastName}`}</h1></div>
          <div className="topbar-actions"><LanguageSelect /><span className="secure"><ShieldCheck /> {t('Secure portal')}</span>{isAdmin && view === 'overview' && <button className="primary" onClick={() => setShowAddCustomer(true)}><Plus />{t('Add customer')}</button>}</div>
        </header>

        <div className="content">
          {
            isAdmin && view === 'overview'
              ? <Customers customers={customers} onOpen={(id) => { setSelectedId(id); setView('documents') }} />
              : <>
                {isAdmin && <button className="back-link" onClick={() => setView('overview')}><ArrowLeft />{t('All customers')}</button>}
                <ProfileStrip customer={customer} isAdmin={isAdmin} onChange={updateCustomer} />
                {view === 'overview' && <CustomerOverview customer={customer} onNavigate={setView} />}
                {view === 'documents' && <Documents customer={customer} isAdmin={isAdmin} onChange={updateCustomer} />}
                {view === 'schedule' && <Schedule customer={customer} customers={customers} isAdmin={isAdmin} onChange={updateCustomer} />}
                {view === 'pricing' && <Pricing customer={customer} isAdmin={isAdmin} onChange={updateCustomer} />}
                {view === 'guide' && <Guide />}
              </>
          }
        </div>
      </main>
      {showAddCustomer && <AddCustomer onClose={() => setShowAddCustomer(false)} onAdd={(newCustomer) => { setCustomers((current) => [...current, newCustomer]); setShowAddCustomer(false) }} nextId={Math.max(...customers.map((item) => item.id)) + 1} />}
    </div>
    </>
  </LanguageContext.Provider>
}

function Login({ customers, onLogin }: { customers: Customer[]; onLogin: (session: { role: Role; customerId?: number }) => void }) {
  const { t } = useLanguage()
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
      <div className="scene-brand"><span>A</span> AZIZA</div><div className="scene-copy"><p>{t('YOUR ARRIVAL, THOUGHTFULLY PLANNED')}</p><h1>{t('Settle into Astana with confidence.')}</h1><span>{t('Documents, appointments and local guidance for your move to Kazakhstan.')}</span></div><div className="scene-credit">Astana, Kazakhstan</div>
    </section>
    <section className="login-panel">
      <div className="login-box">
        <div className="eyebrow">SECURE CLIENT PORTAL</div><h2>{t('Welcome to Astana')}</h2><p>{t('Sign in to continue your relocation journey.')}</p>
        <LanguageSelect />
        <div className="role-switch">
          <button className={role === 'customer' ? 'active' : ''} onClick={() => switchRole('customer')}>{t('Customer')}</button>
          <button className={role === 'admin' ? 'active' : ''} onClick={() => switchRole('admin')}>{t('Administrator')}</button>
        </div>
        <form onSubmit={submit}>
          <label>{t('Login or username')}<input type="text" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>{t('Password')}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary login-submit" type="submit">{t('Sign in')} <ChevronRight /></button>
        </form>
        <div className="demo-note">Demo credentials are prefilled for each role.</div>
      </div>
    </section>
  </div>
}

function Customers({ customers, onOpen }: { customers: Customer[]; onOpen: (id: number) => void }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const filtered = customers.filter((item) => `${item.firstName} ${item.lastName} ${item.email}`.toLowerCase().includes(query.toLowerCase()))
  console.log('customers', customers.length, 'query', query, 'filtered', filtered.length)
  return (
    <section className="panel customer-panel">
      <div className="panel-head">
        <div><h2>{t('All customers')}</h2><p>{customers.length} {t('active customer records')}</p></div>
        <label className="search"><Search /><input placeholder={t('Search customers')} value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      </div>
      <div className="customer-table">
        <div className="table-row table-heading"><span>{t('Customer')}</span><span>{t('Visa & request')}</span><span>{t('Documents')}</span><span>{t('Arrival & departure')}</span><span>{t('Progress')}</span><span></span></div>
        {filtered.map((item) => {
          const uploaded = item.documents.filter((document) => document.status !== 'Missing').length;
          return (
            <button className="table-row" key={item.id} onClick={() => onOpen(item.id)}>
              <span className="customer-cell">
                <b className="avatar">{item.firstName[0]}{item.lastName[0]}</b>
                <span><strong>{item.firstName} {item.lastName}</strong><small>{item.email}</small></span>
              </span>
              <span><strong>{t(item.visaType)}</strong><small>{t(item.requestType)}</small></span>
              <span><strong>{uploaded} / {item.documents.length}</strong><small>{t('received')}</small></span>
              <span><strong>{formatTravelDate(item.arrivalDate)}</strong><small>{t('to')} {formatTravelDate(item.departureDate)}</small></span>
              <span className="progress-cell"><span><i style={{ width: `${item.progress}%` }} /></span><small>{item.progress}%</small></span>
              <span><ChevronRight /></span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ProfileStrip({ customer, isAdmin, onChange }: { customer: Customer; isAdmin: boolean; onChange: (customer: Customer) => void }) {
  const { t } = useLanguage()
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
          <dt>{t('Visa type')}
          </dt>
          <dd>{t(customer.visaType)}
          </dd>
        </div>
        <div>
          <dt>{t('Request')}
          </dt>
          <dd>{t(customer.requestType)}
          </dd>
        </div>
        <div>
          <dt>{t('Overall progress')}
          </dt>
          <dd>{customer.progress}%
          </dd>
        </div>
        <div>
          <dt>{t('Arrival')}
          </dt>
          <dd>{isAdmin
            ? <input aria-label="Arrival date" type="date" value={customer.arrivalDate ?? ''} onChange={(event) => onChange({ ...customer, arrivalDate: event.target.value })} />
            : formatTravelDate(customer.arrivalDate)}
          </dd>
        </div>
        <div>
          <dt>{t('Departure')}
          </dt>
          <dd>{isAdmin
            ? <input aria-label="Departure date" type="date" value={customer.departureDate ?? ''} onChange={(event) => onChange({ ...customer, departureDate: event.target.value })} />
            : formatTravelDate(customer.departureDate)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

function CustomerOverview({ customer, onNavigate }: { customer: Customer; onNavigate: (view: View) => void }) {
  const { t } = useLanguage()
  const next = [...customer.schedule].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0]
  const missing = customer.documents.filter((item) => item.status === 'Missing').length
  return (
    <div className="overview-grid">
      <button className="summary-card" onClick={() => onNavigate('documents')}>
        <FileText />
        <span>
          <small>{t('Documents')}</small>
          <strong>{missing} {t('still needed')}</strong>
        </span>
        <ChevronRight />
      </button>
      <button className="summary-card" onClick={() => onNavigate('schedule')}>
        <CalendarDays />
        <span>
          <small>{t('Next appointment')}</small>
          <strong>{next ? `${formatDate(next.date)}, ${formatTime(next.time)}` : t('Nothing scheduled')}</strong>
        </span>
        <ChevronRight />
      </button>
      <button className="summary-card" onClick={() => onNavigate('pricing')}>
        <CircleDollarSign />
        <span>
          <small>{t('Service estimate')}</small>
          <strong>₸{customer.services.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</strong>
        </span>
        <ChevronRight />
      </button>
      <section className="panel overview-wide">
        <div className="panel-head">
          <div>
            <h2>{t('Your relocation path')}</h2>
            <p>{t('Everything your coordinator has prepared.')}</p>
          </div>
        </div>
        <div className="path-steps">
          <span className="done"><Check /></span>
          <b>{t('Profile created')}</b>
          <span className="done"><Check /></span>
          <b>{t('Plan confirmed')}</b>
          <span className="current">3</span>
          <b>{t('Documents & appointments')}</b>
          <span>4</span>
          <b>{t('Arrival complete')}</b>
        </div>
      </section>
    </div>
  )
}

function Documents({ customer, isAdmin, onChange }: { customer: Customer; isAdmin: boolean; onChange: (customer: Customer) => void }) {
  const { t } = useLanguage()
  const [newName, setNewName] = useState('')
  const [documentChoice, setDocumentChoice] = useState('')
  function markDone(documentId: number) {
    onChange({
      ...customer,
      documents: customer.documents.map((item) => item.id === documentId
        ? {
          ...item,
          status: 'Uploaded',
          uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
        : item)
    })
  }
  function addDocument(event: FormEvent) {
    event.preventDefault();
    if (!newName.trim()) return
    const category = ['Flight ticket', 'Hotel booking'].includes(documentChoice) ? 'Travel' : 'Required'
    onChange({ ...customer, documents: [...customer.documents, { id: Date.now(), name: newName.trim(), category, status: 'Missing' }] });
    setNewName('')
    setDocumentChoice('')
  }
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>{t('Document center')}</h2>
          <p>{t('Mark each requested document complete when you are ready.')}</p>
        </div>
        {isAdmin &&
          <form className="inline-form" onSubmit={addDocument}>
            <select aria-label="Document request" value={documentChoice} onChange={(event) => { setDocumentChoice(event.target.value); setNewName(event.target.value === 'Other' ? '' : event.target.value) }} required>
              <option value="" disabled>{t('Select document')}</option>
              {documentOptions.map((item) => <option key={item} value={item}>{t(item)}</option>)}
            </select>
            {documentChoice === 'Other' && <input aria-label="Document name" placeholder={t('Enter document name')} value={newName} onChange={(event) => setNewName(event.target.value)} required />}
            <button className="secondary" type="submit"><Plus />{t('Add request')}</button>
          </form>
        }
      </div>
      <div className="document-list">
        {customer.documents.map((item) =>
          <div className={`document-row ${item.status.toLowerCase()}`} key={item.id}>
            <div className={`file-icon ${item.status.toLowerCase()}`}>
              <FileText />
            </div>
            <div className="document-name">
              <strong>{t(item.name)}</strong>
              <small>{item.fileName ?? `${t(item.category)} document`}{item.uploadedAt ? ` · ${item.uploadedAt}` : ''}</small>
            </div>
            {!isAdmin &&
              <span className={`status ${item.status.toLowerCase()}`} aria-label={t(item.status)}>
                {item.status === 'Missing' && <X aria-hidden="true" />}
                {item.status !== 'Missing' && <Check aria-hidden="true" />}
              </span>
            }
            <div className="document-actions">
              {isAdmin &&
                <button className={`status-toggle ${item.status.toLowerCase()}`} aria-label={item.status === 'Missing' ? 'Mark document complete' : 'Document complete'} title={item.status === 'Missing' ? 'Mark document complete' : 'Document complete'} onClick={() => item.status === 'Missing' && markDone(item.id)}>
                  {item.status === 'Missing' ? <X /> : <ChevronRight />}
                </button>
              }
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

type CalendarMode = 'month' | 'week' | 'day'

function AdminCalendar({ customers }: { customers: Customer[] }) {
  const { t } = useLanguage()
  const firstAppointment = customers.flatMap((item) => item.schedule).map((item) => item.date).sort()[0] ?? '2026-08-12'
  const [mode, setMode] = useState<CalendarMode>('month')
  const [anchorDate, setAnchorDate] = useState(firstAppointment)
  const appointments = customers.flatMap((customerItem) => customerItem.schedule.map((scheduleItem) => ({ ...scheduleItem, customerName: `${customerItem.firstName} ${customerItem.lastName}` })))
  const dates = mode === 'month' ? getMonthDates(anchorDate) : mode === 'week' ? getWeekDates(anchorDate) : [anchorDate]

  return (
    <section className="panel admin-calendar">
      <div className="panel-head">
        <div><h2>{t('All customer schedules')}</h2><p>{t('Review appointments across every customer.')}</p><strong className="calendar-period">{formatCalendarPeriod(anchorDate, mode)}</strong></div>
        <div className="calendar-controls">
          <button className="calendar-nav" onClick={() => setAnchorDate(shiftCalendarDate(anchorDate, mode, -1))}>{t('Previous')}</button>
          {(['month', 'week', 'day'] as CalendarMode[]).map((calendarMode) =>
            <button key={calendarMode} className={`calendar-mode ${mode === calendarMode ? 'active' : ''}`} onClick={() => setMode(calendarMode)}>{t(calendarMode[0].toUpperCase() + calendarMode.slice(1))}</button>
          )}
          <button className="calendar-nav" onClick={() => setAnchorDate(shiftCalendarDate(anchorDate, mode, 1))}>{t('Next')}</button>
        </div>
      </div>
      <div className={`calendar-grid ${mode}`}>
        {mode === 'month' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}
        {dates.map((date) => {
          const dayAppointments = appointments.filter((item) => item.date === date).sort((a, b) => a.time.localeCompare(b.time))
          return <div className="calendar-day" key={date}>
            <strong>{formatCalendarDate(date, mode)}</strong>
            {dayAppointments.map((item) => <div className="calendar-appointment" key={`${item.customerName}-${item.id}`}><time>{formatTime(item.time)}</time><b>{t(item.title)}</b><small>{item.customerName}</small></div>)}
          </div>
        })}
      </div>
    </section>
  )
}

function Schedule({ customer, customers, isAdmin, onChange }: { customer: Customer; customers: Customer[]; isAdmin: boolean; onChange: (customer: Customer) => void }) {
  const { t } = useLanguage()
  const [draft, setDraft] = useState({ date: '2026-08-12', time: '12:00', title: '', location: '' })
  const [appointmentChoice, setAppointmentChoice] = useState('')
  const grouped = customer.schedule.reduce<Record<string, ScheduleItem[]>>((groups, item) => ({ ...groups, [item.date]: [...(groups[item.date] ?? []), item] }), {})

  function add(event: FormEvent) {
    event.preventDefault();
    if (!draft.title) return;
    onChange({ ...customer, schedule: [...customer.schedule, { id: Date.now(), ...draft }] });
    setDraft({ ...draft, title: '', location: '' })
    setAppointmentChoice('')
  }

  return (
    <div className="two-column">
      {isAdmin ? <AdminCalendar customers={customers} /> : <section className="panel">
          <div className="panel-head">
            <div><h2>{t('Journey schedule')}</h2><p>{t('Your appointments and plans, day by day.')}</p></div>
          </div>
          <div className="timeline">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, items]) =>
            <div className="timeline-day" key={date}>
              <div className="date-block">
                <strong>{new Date(`${date}T00:00`).toLocaleDateString('en-US', { day: '2-digit' })}</strong>
                <span>{new Date(`${date}T00:00`).toLocaleDateString('en-US', { month: 'short' })}</span>
              </div>
              <div>
                {items.sort((a, b) => a.time.localeCompare(b.time)).map((item) =>
                  <div className="timeline-item" key={item.id}>
                    <time>{formatTime(item.time)}</time><span></span>
                    <div>
                      <strong>{t(item.title)}</strong><small>{item.location}</small>
                    </div>
                  </div>
                )}
              </div>
            </div>)
          }
          </div>
        </section>}
      {isAdmin &&
        <section className="panel form-panel">
          <h2>{t('Add to schedule')}
          </h2>
          <p>{t('New items appear in the customer portal instantly.')}
          </p>
          <form onSubmit={add}>
            <label>{t('Date')}
              <input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} required />
            </label>
            <label>{t('Time')}
              <input type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} required />
            </label>
            <label>{t('Appointment')}
              <select value={appointmentChoice} onChange={(event) => { setAppointmentChoice(event.target.value); setDraft({ ...draft, title: event.target.value === 'Other' ? '' : event.target.value }) }} required>
                <option value="" disabled>{t('Select appointment')}</option>
                {appointmentOptions.map((item) => <option key={item} value={item}>{t(item)}</option>)}
              </select>
            </label>
            {appointmentChoice === 'Other' &&
              <label>{t('Appointment name')}
                <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder={t('Enter appointment name')} required />
              </label>
            }
            <button className="primary" type="submit"><Plus />{t('Add appointment')}</button>
          </form>
        </section>
      }
    </div>)
}

function Pricing({ customer, isAdmin, onChange }: { customer: Customer; isAdmin: boolean; onChange: (customer: Customer) => void }) {
  const { t } = useLanguage()
  const [service, setService] = useState(serviceOptions[0]);
  const [otherService, setOtherService] = useState('');
  const [price, setPrice] = useState('');
  const [paidInput, setPaidInput] = useState(String(customer.paid ?? ''))
  const [rates, setRates] = useState<Record<Currency, number>>(fallbackRates)
  const [rateDate, setRateDate] = useState('')
  const total = customer.services.reduce((sum, item) => sum + item.price, 0);
  const paid = Math.max(0, customer.paid ?? 0)
  const outstanding = Math.max(0, total - paid)

  useEffect(() => {
    fetch('https://nationalbank.kz/rss/rates_all.xml')
      .then((response) => {
        if (!response.ok) throw new Error('Exchange rates unavailable')
        return response.text()
      })
      .then((xmlText) => {
        const xml = new DOMParser().parseFromString(xmlText, 'application/xml')
        const nextRates = { ...fallbackRates }
        let publishedDate = ''
        xml.querySelectorAll('item').forEach((item) => {
          const currency = item.querySelector('title')?.textContent?.trim() as Currency
          const rateInKzt = Number(item.querySelector('description')?.textContent)
          const units = Number(item.querySelector('quant')?.textContent) || 1
          if (currency in nextRates && rateInKzt > 0) nextRates[currency] = units / rateInKzt
          publishedDate ||= item.querySelector('pubDate')?.textContent?.trim() ?? ''
        })
        setRates(nextRates)
        setRateDate(publishedDate)
      })
      .catch(() => setRateDate('offline fallback'))
  }, [])

  function add(event: FormEvent) {
    event.preventDefault();
    const serviceName = service === 'Other' ? otherService.trim() : service
    if (!serviceName || !price || Number(price) <= 0) return;
    onChange({ ...customer, services: [...customer.services, { id: Date.now(), name: serviceName, price: Number(price) }] });
    setPrice('')
    setOtherService('')
  }

  function savePayment(event: FormEvent) {
    event.preventDefault()
    const paidAmount = Number(paidInput)
    if (!Number.isFinite(paidAmount) || paidAmount < 0) return
    onChange({ ...customer, paid: paidAmount })
  }

  return (
    <div className="two-column pricing-layout">
      <section className="panel">
        <div className="panel-head">
          <div><h2>{t('Services & pricing')}</h2><p>{t('Base pricing is in Kazakhstan tenge (KZT).')} National Bank rate: {rateDate || 'loading...'}</p></div>
          <select value={customer.currency} onChange={(event) => onChange({ ...customer, currency: event.target.value as Currency })}>
            <option value="KZT">KZT ₸</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="RUB">RUB ₽</option>
          </select>
        </div>
        <div className="price-list">{customer.services.map((item) =>
          <div key={item.id}>
            <span>{t(item.name)}</span>
            <strong>₸{item.price.toLocaleString()}</strong>
            <small>{customer.currency !== 'KZT' ? `≈ ${currencySymbols[customer.currency]}${(item.price * rates[customer.currency]).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ''}</small>
          </div>)}
        </div>
        <div className="price-total">
          <span>{t('Total estimate')}<small>{t('Converted at indicative rate')}</small></span>
          <strong>₸{total.toLocaleString()}
            <small>{customer.currency !== 'KZT' ? `≈ ${currencySymbols[customer.currency]}${(total * rates[customer.currency]).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ''}
            </small>
          </strong>
        </div>
        <div className="balance-list">
          <div><span>{t('Paid')}</span><strong>₸{paid.toLocaleString()}</strong></div>
          <div><span>{t('Amount due')}</span><strong>₸{outstanding.toLocaleString()}</strong></div>
        </div>
      </section>
      {
        isAdmin
          ? <section className="panel form-panel">
            <h2>{t('Update services and payment')}</h2><p>{t('Add a service or record the amount already paid.')}</p>
            <form onSubmit={add}>
              <label>{t('Service')}
                <select value={service} onChange={(event) => setService(event.target.value)}>
                  {serviceOptions.map((item) => <option key={item} value={item}>{t(item)}</option>)}
                </select>
              </label>
              {service === 'Other' &&
                <label>{t('Service name')}
                  <input value={otherService} onChange={(event) => setOtherService(event.target.value)} placeholder="Enter service name" required />
                </label>
              }
              <label>{t('Price in KZT')}
                <input type="number" step="any" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0" required />
              </label>
              <button className="primary" type="submit"><Plus />{t('Add to estimate')}</button>
            </form>
            <form onSubmit={savePayment}>
              <label>{t('Payment received in KZT')}
                <input type="number" step="any" min="0" value={paidInput} onChange={(event) => setPaidInput(event.target.value)} placeholder="0" required />
              </label>
              <button className="secondary" type="submit">{t('Save payment')}</button>
            </form>
          </section>
          : <section className="quote-note">
            <CircleDollarSign /><h3>{t('Clear, local pricing')}</h3><p>{t('Your coordinator updates this estimate as services are confirmed. Currency values are indicative.')}</p>
          </section>
      }
    </div>
  )
}

function Guide() {
  const { t } = useLanguage()
  return (
    <section>
      <div className="section-intro">
        <div>
          <span className="eyebrow">CURATED FOR YOUR STAY</span>
            <h2>{t('Make yourself at home in Astana')}</h2>
            <p>{t('Places selected by your local Aziza coordinator.')}</p>
        </div>
      </div>
      <div className="guide-subsection">
        <div className="guide-subsection-head">
          <span className="eyebrow">{t('PLACES TO STAY')}</span>
          <h2>{t('Hotels for your Astana stay')}</h2>
        </div>
        <div className="guide-grid hotel-grid">
          {hotelItems.map((item) =>
            <article key={item.name}>
              <img src={item.image} alt={item.name} />
              <div>
                <span>{t(item.type)}</span>
                <h3>{item.name}</h3>
                <p>{item.note}</p>
                <a href={item.link ?? '#'} target={item.link ? '_blank' : undefined} rel={item.link ? 'noreferrer' : undefined} aria-label={`${t('View details')} ${item.name}`}><Eye />{t('View details')}</a>
              </div>
            </article>
          )}
        </div>
      </div>
      <div className="itinerary">
        <div className="itinerary-head">
          <span className="eyebrow">{t('FOUR DAYS IN ASTANA')}</span>
          <h2>{t('A considered city itinerary')}</h2>
          <p>{t('A gentle rhythm of landmarks, local food and time to settle in.')}</p>
        </div>
        <div className="itinerary-grid">
          {itinerary.map((item) =>
            <article key={item.day}>
              <img src={item.image} alt={item.title} />
              <span>{item.day}</span>
              <h3>{item.title}</h3>
              <ul>{item.stops.map((stop) => <li key={stop}>{stop}</li>)}</ul>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}

function AddCustomer({ onClose, onAdd, nextId }: { onClose: () => void; onAdd: (customer: Customer) => void; nextId: number }) {
  const { t } = useLanguage()
  const [draft, setDraft] = useState({ firstName: '', lastName: '', dob: '', visaType: 'Digital Nomad Visa', requestType: 'Relocation assistance', email: '', password: 'welcome123', currency: 'KZT' as Currency })

  function submit(event: FormEvent) {
    event.preventDefault();
    onAdd({ ...draft, id: nextId, progress: 10, documents: [{ id: 1, name: 'Passport scan', category: 'Required', status: 'Missing' }, { id: 2, name: 'Flight ticket', category: 'Travel', status: 'Missing' }, { id: 3, name: 'Hotel booking', category: 'Travel', status: 'Missing' }], schedule: [], services: [] })
  }

  return (
    <div className="modal-backdrop">
      <section className="modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">NEW CUSTOMER</span>
            <h2>{t('Create portal access')}</h2>
          </div>
          <button className="icon-button" onClick={onClose}><X /></button>
        </div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>{t('First name')}
              <input value={draft.firstName} onChange={(event) => setDraft({ ...draft, firstName: event.target.value })} required />
            </label>
            <label>{t('Last name')}
              <input value={draft.lastName} onChange={(event) => setDraft({ ...draft, lastName: event.target.value })} required />
            </label>
            <label>{t('Visa type')}
              <select value={draft.visaType} onChange={(event) => setDraft({ ...draft, visaType: event.target.value })}>
                <option value="Digital Nomad Visa">{t('Digital Nomad Visa')}</option>
                <option value="Work Visa">{t('Work Visa')}</option>
                <option value="Residence Permit">{t('Residence Permit')}</option>
                <option value="Tourist Visa">{t('Tourist Visa')}</option>
              </select>
            </label>
            <label>{t('Request type')}<input value={draft.requestType} onChange={(event) => setDraft({ ...draft, requestType: event.target.value })} required /></label>
            <label>{t('Preferred currency')}<select value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value as Currency })}>
              <option>KZT</option>
              <option>USD</option>
              <option>EUR</option>
              <option>RUB</option>
            </select>
            </label>
            <label>Login or username<input type="text" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} required /></label>
            <label>{t('Temporary password')}<input value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} required /></label>
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary" onClick={onClose}>{t('Cancel')}</button>
            <button className="primary" type="submit">{t('Create customer')}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

function formatDate(date: string) { return new Date(`${date}T00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }
function formatTravelDate(date?: string) { return date ? new Date(`${date}T00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Not set' }

export default App