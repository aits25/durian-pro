import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Leaf, 
  Droplets, 
  Cloud, 
  DollarSign,
  BarChart2, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Menu, 
  X,
  Sprout,
  Wind,
  TrendingUp,
  Scale,
  Upload,
  Filter,
  User,
  Plus,
  Save,
  Download,
  FileText,
  HelpCircle,
  Share,
  Pencil,
  Trash2,
  XCircle,
  CheckCircle,
  Eye,
  EyeOff,
  History,
  Clock,
  Link as LinkIcon,
  CloudUpload,
  Loader,
  Wrench,
  Zap,
  MoreHorizontal,
  RefreshCcw,
  Activity,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  UserCheck,
  Sun,
  CloudRain,
  Banknote,
  Bell,
  PieChart,
  Image as ImageIcon,
  ExternalLink,
  WifiOff,
  Beaker,
  Bug,
  ShieldCheck,
  Info,
  BookOpen,
  Search,
  Tag,
  MessageSquare
} from 'lucide-react';
import { GeminiProvider } from './GeminiContext';
import AIAdvisor from './AIAdvisor';

// --- CONFIGURATION ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwm4H_D-vUZ2hRxHXuWZVcaPGdvWeXAkD2kuw95XCUXSpCPr9C8vvz-khkjXqUvlKYT3w/exec"; 

// --- MASTER DATA ---
const ORCHARD_LIST = [
  { id: 'O-001', name: 'สถานีหมอนทอง', area: '18 ไร่' },
  { id: 'O-002', name: 'ถ้ำหลวง', area: '20 ไร่' },
  { id: 'O-003', name: 'สวนนบ', area: '5 ไร่' },
  { id: 'O-004', name: 'ไทรห้อย', area: '5 ไร่' },
  { id: 'O-005', name: 'หลังโรงเรียน', area: '10 ไร่' },
  { id: 'O-006', name: '13 ไร่', area: '13 ไร่' },  
];

const CARETAKER_LIST = ["พี่เรย์-เอก", "ติง-พิมพ์", "ซัลไล", "บ่าว", "ไม่มี"];

const HARVEST_GRADES = [
  { id: 'grade_a', name: 'เบอร์ดี', color: 'bg-green-100 text-green-700', barColor: 'bg-green-500', hex: '#22c55e' },
  { id: 'grade_top', name: 'เบอร์ท๊อป', color: 'bg-yellow-100 text-yellow-800', barColor: 'bg-yellow-500', hex: '#eab308' },
  { id: 'grade_fall', name: 'เบอร์ตกไซส์', color: 'bg-red-100 text-red-700', barColor: 'bg-red-500', hex: '#ef4444' },
];

const EXPENSE_TYPES = [
  { id: 'fertilizer', name: 'ค่าปุ๋ย', icon: Sprout, color: 'text-green-600 bg-green-50' },
  { id: 'chemical', name: 'ยา/เคมี', icon: Zap, color: 'text-purple-600 bg-purple-50' },
  { id: 'fuel', name: 'น้ำมัน', icon: Droplets, color: 'text-orange-600 bg-orange-50' },
  { id: 'repair', name: 'ค่าซ่อม', icon: Wrench, color: 'text-gray-600 bg-gray-50' },
  { id: 'salary', name: 'เบิกเงิน', icon: Banknote, color: 'text-gray-600 bg-gray-50' },
  { id: 'other', name: 'อื่นๆ', icon: MoreHorizontal, color: 'text-blue-600 bg-blue-50' },
];

// ฐานข้อมูลสินค้าเกษตร (ข้อมูลที่นำเข้าจาก CSV)
const AGRICULTURAL_PRODUCTS = [
 ];

// ฐานข้อมูลกลุ่มสารเคมี (IRAC Database for Durian)
const CHEMICAL_DATABASE = [
  { group: 'กลุ่ม 1', name: 'คาร์บาเมต / ออร์กาโนฟอสเฟต', items: 'คาร์บาริล, คลอไพริฟอส', target: 'เพลี้ยไก่แจ้, หนอนเจาะลำต้น', danger: 'เสี่ยงดื้อยาสูงหากใช้ซ้ำ' },
  { group: 'กลุ่ม 2', name: 'ฟิโพรนิล / ฟีนิลไพราโซล', items: 'ฟิโพรนิล', target: 'ปลวก, เพลี้ยไฟ, หนอนเจาะผล', danger: 'เป็นพิษต่อแมลงที่มีประโยชน์' },
  { group: 'กลุ่ม 4', name: 'นีโอนิโคตินอยด์', items: 'อิมิดาโคลพริด, ไทอะมีทอกแซม', target: 'เพลี้ยกระโดด, เพลี้ยจักจั่น', danger: 'ดูดซึมดีมาก' },
  { group: 'กลุ่ม 6', name: 'อะบาเมกติน', items: 'อะบาเมกติน, อีมาเมกติน', target: 'ไรแดง, หนอนกระทู้', danger: 'ห้ามใช้ซ้ำติดต่อกันเกิน 2 รอบ' },
  { group: 'กลุ่ม 28', name: 'ไดอะไมด์', items: 'คลอแรนทรานิลิโพรล', target: 'หนอนเจาะผลทุเรียน', danger: 'ปลอดภัยต่อแมลงศัตรูธรรมชาติ' },
];

// ฐานข้อมูลกลุ่มสารป้องกันกำจัดโรคพืช (FRAC Database - ทุเรียน)
const FUNGICIDE_DATABASE = [
  { group: 'กลุ่ม 1', common: 'คาร์เบนดาซิม (Carbendazim)', trade: 'บาวีสติน, คาร์เบน, เดอร์ซาล', benefit: 'โรคราสีชมพู, แอนแทรคโนส, ใบจุด', advice: 'ใช้ป้องกันและรักษาโรคที่มีสาเหตุจากเชื้อรา Ascomycetes ห้ามใช้ซ้ำเกิน 2 ครั้งต่อรอบเพื่อเลี่ยงการดื้อยา' },
  { group: 'กลุ่ม 3', common: 'เฮกซะโคนาโซล / ไดฟีโนโคนาโซล', trade: 'แอนวิล, อัลโต, สกอร์', benefit: 'โรคราใบติด (Rhizoctonia), ใบจุดสาหร่าย', advice: 'กลุ่ม Triazole มีผลกดการเจริญเติบโตหากใช้เกินอัตรา ระวังในช่วงดึงดอกหรือแตกใบอ่อน' },
  { group: 'กลุ่ม 4', common: 'เมทาแลกซิล (Metalaxyl)', trade: 'เอพรอน, เมทาแลกซิล 25', benefit: 'ไฟทอปเทอร่า (รากเน่าโคนเน่า)', advice: 'ดูดซึมดีมาก เหมาะสำหรับถากทาแผลที่โคนต้น หรือฉีดพ่นเมื่อพบการระบาดของราเน่า' },
  { group: 'กลุ่ม 11', common: 'อะซอกซีสโตรบิน / ไพราโคลสโตรบิน', trade: 'อมิสตาร์, เฮดไลน์, อินสิกเนีย', benefit: 'แอนแทรคโนส, ราใบติด, ป้องกันวงกว้าง', advice: 'ประสิทธิภาพสูงในการป้องกันเชื้อดื้อยากลุ่มอื่น ห้ามใช้ยากลุ่มนี้ซ้ำติดต่อกันเกิน 2 ครั้ง' },
  { group: 'กลุ่ม 33', common: 'ฟอสโฟนิก แอซิด / ฟอสอีทิล-อะลูมิเนียม', trade: 'อาลิเอท, ฟอสโฟนิก, รูเบิล', benefit: 'โรครากเน่าโคนเน่า, กิ่งแห้งไฟทอปเทอร่า', advice: 'ช่วยกระตุ้นภูมิคุ้มกันพืช (SAR) นิยมใช้ฉีดเข้าลำต้นเพื่อรักษาแผลเน่าที่รักษาด้วยวิธีอื่นไม่หาย' },
  { group: 'กลุ่ม 40', common: 'ไดเมทโทมอร์ฟ (Dimethomorph)', trade: 'ฟอรัม, อะโครแบท', benefit: 'ไฟทอปเทอร่า, ราน้ำค้าง', advice: 'ใช้ยับยั้งการสร้างผนังเซลล์ของเชื้อรา Oomycetes เหมาะใช้สลับกับกลุ่ม 4 หรือ 33' },
  { group: 'กลุ่ม M', common: 'แมนโคเซ็บ / คอปเปอร์ / กำมะถัน', trade: 'ไดเทน M-45, คูปราวิท, คอปเปอร์ออกซีคลอไรด์', benefit: 'ป้องกันราทั่วไป, ใบจุด, ราดำ', advice: 'เป็นยากลุ่มสัมผัส (Multi-site) เชื้อดื้อยากลุ่มนี้ยากมาก เหมาะสำหรับพ่นป้องกันในช่วงฝนชุก' }
];

// --- Helpers ---
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const safeParseFloat = (val) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val.replace(/,/g, '')) || 0;
  return 0;
};

const getDirectImageUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') return null;
  if (url.startsWith('data:image')) return url;
  const driveIdMatch = url.match(/[-\w]{25,}/);
  if (url.includes('drive.google.com') && driveIdMatch) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[0]}`;
  }
  return url;
};

const normalizeDate = (dateStr) => {
  if (!dateStr) return '';
  let d;
  if (typeof dateStr === 'string') {
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        let [day, month, year] = parts;
        if (parseInt(year) > 2400) year = (parseInt(year) - 543).toString();
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    d = new Date(dateStr);
  } else {
    d = new Date(dateStr);
  }
  if (isNaN(d.getTime())) return dateStr;
  const localYear = d.getFullYear();
  const localMonth = String(d.getMonth() + 1).padStart(2, '0');
  const localDay = String(d.getDate()).padStart(2, '0');
  return `${localYear}-${localMonth}-${localDay}`;
};

const formatToThaiDate = (isoDate) => {
  if (!isoDate || typeof isoDate !== 'string') return '-';
  if (isoDate.match(/[ก-๙]/)) return isoDate;
  const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  try {
    let dateToUse = normalizeDate(isoDate);
    const [year, month, day] = dateToUse.split('-');
    if (!year || !month || !day) return isoDate;
    const monthIndex = parseInt(month) - 1;
    if (monthIndex < 0 || monthIndex > 11) return isoDate;
    const buddhistYear = (parseInt(year) + 543).toString().slice(-2);
    return `${parseInt(day)} ${thaiMonths[monthIndex]} ${buddhistYear}`;
  } catch (e) { return isoDate; }
};

const dateToValue = (dateStr) => {
  if (!dateStr) return 0;
  const normalized = normalizeDate(dateStr);
  return parseInt(normalized.replace(/-/g, '')) || 0;
};

const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const BrandBadge = ({ size = "md" }) => {
  const isLarge = size === "lg";
  return (
    <div className={`relative flex items-center justify-center rounded-full border-2 border-green-800 bg-white shadow-sm overflow-hidden 
      ${isLarge ? 'w-12 h-12' : 'w-10 h-10'}`}>
      <div className="absolute inset-0 border-[3px] border-white rounded-full"></div>
      <div className="z-10 bg-green-800 rounded-full p-1 flex items-center justify-center transform hover:scale-110 transition-transform">
        <Sprout className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'} text-yellow-400`} />
      </div>
    </div>
  );
};

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'overview', label: 'ภาพรวมสวน', icon: BarChart2 },
    { id: 'catalog', label: 'ฐานข้อมูลสินค้าเกษตร', icon: BookOpen }, // เพิ่มเมนูใหม่
    { id: 'harvest', label: 'บันทึกการขาย', icon: Scale }, 
    { id: 'maintenance', label: 'ตารางงาน/ฉีดยา-ปุ๋ย', icon: Calendar },
    { id: 'expenses', label: 'บันทึกค่าใช้จ่าย', icon: DollarSign },
    { id: 'Chemicals', label: 'สารเคมีกำจัดแมลง', icon: Beaker },
    { id: 'Fungicides', label: 'สารป้องกันกำจัดโรคพืช', icon: ShieldCheck },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <BrandBadge />
        <div>
          <span className="block text-lg font-black text-green-900 leading-none tracking-tighter uppercase italic">Durian Pro</span>
          <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">KrungChing</span>
        </div>
      </div>
      
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto border-b border-gray-100">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (window.innerWidth < 768) setIsOpen(false);
            }}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-green-50 text-green-700 font-bold' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-yellow-400 text-sm font-bold border-2 border-white italic">aits</div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-700 truncate">สถานีหมอนทอง</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">v.2.5 CSV</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- เมนูใหม่: ฐานข้อมูลสินค้าเกษตร ---
const CatalogTab = ({ data, setData, syncToCloud, isSyncing, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('ทั้งหมด');

  // ดึงข้อมูลจาก Cloud เมื่อ component load
  useEffect(() => {
    if (!data || data.length === 0) {
      onRefresh();
    }
  }, []);

  const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);
  const brands = ['ทั้งหมด', ...new Set(safeData.map(p => p.brand))];

  const filteredProducts = useMemo(() => {
    return safeData.filter(product => {
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.usage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.active.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBrand = filterBrand === 'ทั้งหมด' || product.brand === filterBrand;
      return matchSearch && matchBrand;
    });
  }, [searchTerm, filterBrand, safeData]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2 italic uppercase">
            <BookOpen className="text-green-600" /> Agricultural Products
          </h2>
          <p className="text-gray-500 text-sm italic">สมุดคู่มือสินค้าเกษตร รวบรวมข้อมูลสินค้าบริษัทชั้นนำ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นชื่อสินค้า, สรรพคุณ หรือชื่อสามัญ..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none font-bold text-gray-700"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          {brands.map(b => <option key={b} value={b}>{b === 'ทั้งหมด' ? 'บริษัททั้งหมด' : b}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
            <div className="bg-green-600 p-3 flex justify-between items-center text-white">
               <span className="text-[10px] font-black uppercase tracking-widest">{product.brand}</span>
               <span className="text-[9px] font-bold opacity-75 italic">{product.group}</span>
            </div>
            <div className="p-5 space-y-4 flex-1">
               <div className="space-y-1">
                  <h4 className="text-md font-bold text-gray-800 leading-snug group-hover:text-green-700 transition-colors">{product.name}</h4>
                  <div className="flex items-center gap-1.5">
                    <Tag size={12} className="text-green-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{product.category}</span>
                  </div>
               </div>
               <p className="text-[11px] text-gray-500 leading-relaxed italic">{product.usage}</p>
            </div>
            <div className="p-5 pt-0 mt-auto">
               <div className="pt-3 border-t border-gray-50">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">สารสำคัญ</p>
                  <p className="text-[10px] font-bold text-gray-700">{product.active}</p>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-400 italic">ไม่พบข้อมูลสินค้าที่คุณค้นหา</div>
      )}
    </div>
  );
};

const ChemicalsTab = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">สารเคมีกำจัดแมลง</h2>
          <p className="text-gray-500 text-sm">ข้อมูลกลุ่มสารเคมี IRAC เพื่อวางแผนการสลับยาป้องกันการดื้อยา</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2.5 rounded-xl border border-yellow-100 text-yellow-700 font-bold text-sm">
          <AlertTriangle size={18} /> ห้ามใช้ยากลุ่มเดิมซ้ำเกิน 2 ครั้งติดต่อกัน
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHEMICAL_DATABASE.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white group-hover:bg-green-700 transition-colors">
              <span className="text-xl font-black italic uppercase tracking-tighter">{item.group}</span>
              <Beaker size={24} className="opacity-30" />
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ชื่อกลุ่มสารทางเคมี</h4>
                <p className="text-sm font-bold text-gray-800 leading-snug">{item.name}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ตัวอย่างสารสามัญ</h4>
                <p className="text-sm text-gray-600">{item.items}</p>
              </div>
              <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[9px] font-black text-green-600 uppercase mb-1 flex items-center gap-1"><Bug size={10} /> แมลงเป้าหมาย</h4>
                  <p className="text-[11px] text-gray-500 leading-tight">{item.target}</p>
                </div>
                <div className="border-l border-gray-50 pl-4">
                  <h4 className="text-[9px] font-black text-red-500 uppercase mb-1 flex items-center gap-1"><Info size={10} /> คำแนะนำ</h4>
                  <p className="text-[11px] text-gray-500 leading-tight">{item.danger}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm"><ShieldCheck size={40} /></div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold">หลักการสลับกลุ่มสาร (Resistance Management)</h3>
          <p className="text-sm text-blue-50 leading-relaxed">
            หัวใจสำคัญคือการ "สลับเลขกลุ่มสาร" ในแต่ละรอบการฉีดพ่น เพื่อไม่ให้แมลงที่รอดชีวิตสร้างภูมิต้านทาน 
            ควรเลือกยาที่มีเลขกลุ่มต่างจากรอบล่าสุดเสมอ เพื่อรักษาประสิทธิภาพของสารเคมีในระยะยาว
          </p>
        </div>
      </div>
    </div>
  );
};

const FungicidesTab = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">สารป้องกันกำจัดโรคพืช</h2>
          <p className="text-gray-500 text-sm">ข้อมูลกลุ่มสารเชื้อรา FRAC (ทุเรียน) ตามคำแนะนำกรมวิชาการเกษตร</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100 text-blue-700 font-bold text-sm">
          <ShieldCheck size={18} /> ป้องกันเชื้อดื้อยาด้วยการสลับกลุ่มสาร (FRAC Group)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FUNGICIDE_DATABASE.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white group-hover:bg-blue-700 transition-colors">
              <span className="text-xl font-black italic uppercase tracking-tighter">{item.group}</span>
              <ShieldCheck size={24} className="opacity-30" />
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ชื่อสามัญ (Common Name)</h4>
                <p className="text-sm font-bold text-gray-800 leading-snug">{item.common}</p>
                <p className="text-[10px] text-gray-400 mt-1">ชื่อการค้าตัวอย่าง: {item.trade}</p>
              </div>
              <div className="pt-4 border-t border-gray-50 space-y-3">
                <div>
                  <h4 className="text-[9px] font-black text-blue-600 uppercase mb-1 flex items-center gap-1"><Activity size={10} /> ประโยชน์ / โรคเป้าหมาย</h4>
                  <p className="text-[11px] text-gray-700 font-medium leading-tight">{item.benefit}</p>
                </div>
                <div>
                  <h4 className="text-[9px] font-black text-orange-600 uppercase mb-1 flex items-center gap-1"><Info size={10} /> คำแนะนำการใช้แก้ปัญหาโรค</h4>
                  <p className="text-[11px] text-gray-500 leading-snug italic">{item.advice}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HarvestTab = ({ data, setData, syncToCloud, isSyncing, onRefresh, fetchError }) => { 
  const [filterOrchard, setFilterOrchard] = useState('ทั้งหมด');
  const [filterStartDate, setFilterStartDate] = useState(''); 
  const [filterEndDate, setFilterEndDate] = useState('');    
  const [filterCaretaker, setFilterCaretaker] = useState('ทั้งหมด');
  const [showTotalSales, setShowTotalSales] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [newItem, setNewItem] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    orchard: ORCHARD_LIST[0].name, 
    caretaker: CARETAKER_LIST[0], 
    type: 'เบอร์ดี', 
    weight: '', 
    price: '' 
  });

  const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);
  
  const filteredData = useMemo(() => {
    return safeData.filter(item => {
      const itemDateVal = dateToValue(item.date);
      const startVal = filterStartDate ? dateToValue(filterStartDate) : 0;
      const endVal = filterEndDate ? dateToValue(filterEndDate) : 99999999;
      
      return (filterOrchard === 'ทั้งหมด' || item.orchard === filterOrchard) &&
      (filterCaretaker === 'ทั้งหมด' || item.caretaker === filterCaretaker) &&
      (itemDateVal >= startVal && itemDateVal <= endVal);
    }).sort((a, b) => dateToValue(b.date) - dateToValue(a.date));
  }, [safeData, filterOrchard, filterCaretaker, filterStartDate, filterEndDate]);

  const totalSales = filteredData.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalWeight = filteredData.reduce((sum, item) => sum + (item.weight || 0), 0);
  const avgPrice = totalWeight > 0 ? (totalSales / totalWeight) : 0;

  const orchardSalesStackedData = useMemo(() => {
    const orchardGroups = ORCHARD_LIST.map(orchard => {
      const orchardItems = filteredData.filter(item => item.orchard === orchard.name);
      const gradesData = HARVEST_GRADES.map(grade => {
        const val = orchardItems
          .filter(item => item.type === grade.name)
          .reduce((sum, item) => sum + (item.total || 0), 0);
        return { ...grade, value: val };
      });
      const total = gradesData.reduce((sum, g) => sum + g.value, 0);
      return { name: orchard.name, grades: gradesData, total };
    }).filter(i => i.total > 0).sort((a,b) => b.total - a.total);
    const maxTotal = Math.max(...orchardGroups.map(o => o.total), 1);
    return { data: orchardGroups, maxTotal };
  }, [filteredData]);

  const gradeWeightData = useMemo(() => {
    const summary = HARVEST_GRADES.map(g => ({ ...g, value: 0 }));
    filteredData.forEach(item => {
      const gradeIndex = summary.findIndex(s => s.name === item.type);
      if (gradeIndex !== -1) summary[gradeIndex].value += (item.weight || 0);
    });
    return summary;
  }, [filteredData]);

  const pieGradient = useMemo(() => {
    if (totalWeight === 0) return 'gray 0% 100%';
    let currentDeg = 0;
    const gradients = gradeWeightData.map(grade => {
        const pct = (grade.value / totalWeight) * 100;
        const start = currentDeg;
        const end = currentDeg + pct;
        currentDeg = end;
        return `${grade.hex} ${start}% ${end}%`;
    });
    return `conic-gradient(${gradients.join(', ')})`;
  }, [gradeWeightData, totalWeight]);

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!newItem.date || !newItem.orchard || !newItem.weight || !newItem.price) return;
    const weight = safeParseFloat(newItem.weight);
    const price = safeParseFloat(newItem.price);
    const total = weight * price;
    let updatedData;
    if (editingId) {
      updatedData = safeData.map(item => item.id === editingId ? { ...item, ...newItem, weight, price, total } : item);
      setEditingId(null);
      setIsFormOpen(false); 
    } else {
      updatedData = [{ ...newItem, id: generateId(), weight, price, total }, ...safeData];
    }
    setData(updatedData);
    setNewItem({ date: new Date().toISOString().split('T')[0], orchard: ORCHARD_LIST[0].name, caretaker: CARETAKER_LIST[0], type: 'เบอร์ดี', weight: '', price: '' });
    syncToCloud('saveHarvest', updatedData, true);
  };

  const handleEdit = (item) => {
    setNewItem({
      date: normalizeDate(item.date),
      orchard: item.orchard,
      caretaker: item.caretaker === '-' ? CARETAKER_LIST[0] : (item.caretaker || CARETAKER_LIST[0]),
      type: item.type,
      weight: item.weight,
      price: item.price
    });
    setEditingId(item.id);
    setIsFormOpen(true); 
  };

  const handleDelete = (id) => {
    const updatedData = safeData.filter(item => item.id !== id);
    setData(updatedData);
    syncToCloud('saveHarvest', updatedData, true);
  };

  const calculatedTotal = (safeParseFloat(newItem.weight) * safeParseFloat(newItem.price)) || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">บันทึกการขายและผลผลิต</h2>
          <p className="text-gray-500 text-sm">จัดการข้อมูลการตัดทุเรียนและยอดขาย</p>
        </div>
      </div>
      
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
           <WifiOff size={20} />
           <span>ไม่สามารถเชื่อมต่อข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือติดต่อผู้ดูแลระบบ</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
               <p className="text-gray-500 text-sm font-medium">ยอดขายรวม</p>
               <div className="bg-yellow-50 p-1.5 rounded-md text-yellow-600"><DollarSign size={16} /></div>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-800">
                {showTotalSales ? `฿${totalSales.toLocaleString()}` : '฿xxx,xxx'}
              </h3>
              <button onClick={() => setShowTotalSales(!showTotalSales)} className="text-gray-400 hover:text-gray-600">
                  {showTotalSales ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
               <p className="text-gray-500 text-sm font-medium">น้ำหนักรวม</p>
               <div className="bg-green-50 p-1.5 rounded-md text-green-600"><Scale size={16} /></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{totalWeight.toLocaleString()} <span className="text-sm font-normal text-gray-500">กก.</span></h3>
         </div>
         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
               <p className="text-gray-500 text-sm font-medium">ราคาเฉลี่ย</p>
               <div className="bg-blue-50 p-1.5 rounded-md text-blue-600"><TrendingUp size={16} /></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">฿{avgPrice.toFixed(2)}</h3>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
               <BarChart2 size={20} className="text-blue-500" /> ยอดขายแยกตามสวน (Stacked)
            </h3>
            <div className="space-y-5">
               {orchardSalesStackedData.data.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">ไม่มีข้อมูลยอดขาย</p>
               ) : (
                  orchardSalesStackedData.data.map((orchard, index) => {
                     const totalWidthPct = (orchard.total / orchardSalesStackedData.maxTotal) * 100;
                     return (
                        <div key={index} className="relative">
                           <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-medium text-gray-700">{orchard.name}</span>
                              <span className="text-gray-900 font-bold">฿{orchard.total.toLocaleString()}</span>
                           </div>
                           <div className="w-full bg-gray-50 rounded-full h-3.5 overflow-hidden flex justify-start">
                              <div className="h-full flex rounded-full overflow-hidden transition-all duration-500" style={{ width: `${totalWidthPct}%` }}>
                                 {orchard.grades.map((grade, idx) => {
                                     if (grade.value === 0) return null;
                                     const innerPct = (grade.value / orchard.total) * 100;
                                     return (
                                        <div key={idx} style={{ width: `${innerPct}%` }} className={`${grade.barColor}`} title={`${grade.name}: ฿${grade.value.toLocaleString()}`} />
                                     )
                                 })}
                              </div>
                           </div>
                        </div>
                     );
                  })
               )}
            </div>
            <div className="flex gap-4 mt-6 justify-center flex-wrap">
               {HARVEST_GRADES.map(g => (
                  <div key={g.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                     <div className={`w-3 h-3 rounded-full ${g.barColor}`}></div>
                     {g.name}
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 w-full">
               <PieChart size={20} className="text-purple-500" /> สัดส่วนน้ำหนักตามเกรด
            </h3>
            {totalWeight === 0 ? (
               <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                  <p>ไม่มีข้อมูลน้ำหนัก</p>
               </div>
            ) : (
               <div className="relative w-full flex flex-col items-center">
                  <div className="w-48 h-48 rounded-full shadow-inner transition-all duration-500 relative" style={{ background: pieGradient }}>
                     <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex items-center justify-center flex-col">
                        <span className="text-xs text-gray-400">รวม</span>
                        <span className="text-sm font-bold text-gray-800">{totalWeight.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">กก.</span>
                     </div>
                  </div>
                  <div className="w-full mt-6 space-y-2">
                     {gradeWeightData.map((data, index) => {
                        const percentage = totalWeight > 0 ? (data.value / totalWeight) * 100 : 0;
                        if(data.value === 0) return null;
                        return (
                           <div key={index} className="flex justify-between items-center text-sm border-b border-gray-50 pb-1">
                              <div className="flex items-center gap-2">
                                 <div className={`w-3 h-3 rounded-sm ${data.barColor}`}></div>
                                 <span className="text-gray-600">{data.name}</span>
                              </div>
                              <div className="text-right">
                                 <span className="font-medium text-gray-800 mr-2">{data.value.toLocaleString()} กก.</span>
                                 <span className="text-xs text-gray-400">({percentage.toFixed(1)}%)</span>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <button onClick={() => setIsFormOpen(!isFormOpen)} className="w-full flex items-center justify-between font-bold text-gray-800 text-lg focus:outline-none">
              <div className="flex items-center gap-2">
                 {editingId ? <Pencil size={18} className="text-blue-500" /> : <Plus size={18} className="text-green-500" />}
                 {editingId ? 'แก้ไขรายการ' : 'เพิ่มรายการขาย'}
              </div>
              <div className={`transition-transform duration-200 ${isFormOpen ? 'rotate-180' : ''}`}>
                 <ChevronDown size={20} className="text-gray-400" />
              </div>
            </button>
            {isFormOpen && (
              <div className="mt-5 animate-in slide-in-from-top-2 duration-200">
                <form onSubmit={handleSaveItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ตัดทุเรียน</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={newItem.date} onChange={(e) => setNewItem({...newItem, date: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">สวนที่ผลิต</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={newItem.orchard} onChange={(e) => setNewItem({...newItem, orchard: e.target.value})}>
                      {ORCHARD_LIST.map(o => <option key={o.id}>{o.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ผู้ดูแลรับผิดชอบ</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={newItem.caretaker} onChange={(e) => setNewItem({...newItem, caretaker: e.target.value})}>
                      {CARETAKER_LIST.map((name, index) => <option key={index} value={name}>{name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เกรด/ไซส์</label>
                    <div className="flex gap-2">
                      {HARVEST_GRADES.map(grade => (
                        <button key={grade.id} type="button" onClick={() => setNewItem({...newItem, type: grade.name})} className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${newItem.type === grade.name ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                          {grade.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก (กก.)</label>
                      <input type="number" step="0.01" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="0.00" value={newItem.weight} onChange={(e) => setNewItem({...newItem, weight: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ราคา/กก.</label>
                      <input type="number" step="0.01" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="0.00" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-green-800">ยอดรวมสุทธิ</span>
                    <span className="text-xl font-bold text-green-700">฿{calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                  </div>
                  <button type="submit" className={`w-full text-white font-medium py-3 rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                    {editingId ? <Save size={18} /> : <Plus size={18} />}
                    <span>{editingId ? 'อัปเดตข้อมูล' : 'บันทึกรายการ'}</span>
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setIsFormOpen(false); setNewItem({ date: new Date().toISOString().split('T')[0], orchard: ORCHARD_LIST[0].name, caretaker: CARETAKER_LIST[0], type: 'เบอร์ดี', weight: '', price: '' }); }} className="w-full text-gray-500 font-medium py-2 text-sm hover:text-red-500 transition-colors">ยกเลิกการแก้ไข</button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><History size={20} className="text-gray-400" /> ประวัติ</h3>
             <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
               <div className="flex items-center gap-2 flex-1 sm:flex-none">
                 <input type="date" className="bg-white border border-gray-200 text-sm text-gray-600 rounded-lg px-2 py-1.5 outline-none w-full sm:w-auto" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} placeholder="เริ่มต้น" />
                 <span className="text-gray-400">-</span>
                 <input type="date" className="bg-white border border-gray-200 text-sm text-gray-600 rounded-lg px-2 py-1.5 outline-none w-full sm:w-auto" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} placeholder="สิ้นสุด" />
               </div>
               <select className="bg-white border border-gray-200 text-sm text-gray-600 rounded-lg px-3 py-1.5 outline-none flex-1 sm:flex-none" value={filterCaretaker} onChange={e => setFilterCaretaker(e.target.value)}>
                 <option value="ทั้งหมด">ผู้ดูแลทั้งหมด</option>
                 {CARETAKER_LIST.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
               <select className="bg-white border border-gray-200 text-sm text-gray-600 rounded-lg px-3 py-1.5 outline-none flex-1 sm:flex-none" value={filterOrchard} onChange={e => setFilterOrchard(e.target.value)}>
                 <option value="ทั้งหมด">สวนทั้งหมด</option>
                 {ORCHARD_LIST.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
               </select>
             </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-100">
               <div className="col-span-2">วันที่</div>
               <div className="col-span-2">สวน</div>
               <div className="col-span-2">เกรด</div>
               <div className="col-span-1 text-right">นน.</div>
               <div className="col-span-1 text-right">ราคา</div>
               <div className="col-span-2 text-right">ยอดสุทธิ</div>
               <div className="col-span-1">ผู้ดูแล</div>
               <div className="col-span-1"></div>
             </div>
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                <TrendingUp className="w-10 h-10 mb-2 opacity-20" /><p>ไม่พบข้อมูลตามเงื่อนไข</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                    <div key={item.id} className="group grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-50 transition-colors">
                       <div className="col-span-2 text-sm text-gray-600 font-medium">{formatToThaiDate(item.date)}</div>
                       <div className="col-span-2 text-sm text-gray-800 font-semibold truncate">{item.orchard}</div>
                       <div className="col-span-2"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${HARVEST_GRADES.find(g => g.name === item.type)?.color || 'bg-gray-100 text-gray-600'}`}>{item.type}</span></div>
                       <div className="col-span-1 text-right text-sm text-gray-600">{item.weight?.toLocaleString()}</div>
                       <div className="col-span-1 text-right text-sm text-gray-600">{item.price?.toLocaleString()}</div>
                       <div className="col-span-2 text-right text-sm font-bold text-green-600">{item.total?.toLocaleString()}</div>
                       <div className="col-span-1 text-xs text-gray-400 truncate">{item.caretaker || '-'}</div>
                       <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"><Trash2 size={14} /></button>
                       </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MaintenanceTab = ({ data, setData, syncToCloud, isSyncing, onRefresh, fetchError }) => { 
  const [newActivity, setNewActivity] = useState({
    date: new Date().toISOString().split('T')[0],
    orchard: ORCHARD_LIST[0].name,
    type: 'ฉีดยา',
    details: '',
    product: '',
    productActive: '',
    productGroup: '',
    dosage: '',
    unit: 'ml'
  });
  const [filterOrchard, setFilterOrchard] = useState('ทั้งหมด');
  const [filterType, setFilterType] = useState('ทั้งหมด');
  const PRESET_ACTIVITIES = ['ฉีดยา', 'ใส่ปุ๋ย', 'ตัดหญ้า'];
  const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);
  const uniqueActivityTypes = useMemo(() => {
     const types = new Set([...PRESET_ACTIVITIES, ...safeData.map(d => d.type)]);
     return Array.from(types).filter(Boolean).sort();
  }, [safeData]);
  // cloud-backed chemical search
  const [chemicalSearch, setChemicalSearch] = useState('');
  const [cloudChemicals, setCloudChemicals] = useState([]);
  const [cloudLoading, setCloudLoading] = useState(false);
  const searchControllerRef = useRef(null);
  const searchTimerRef = useRef(null);
  const chemicalInputRef = useRef(null);

  const fetchCloudProducts = async (q = '') => {
    if (!GOOGLE_SCRIPT_URL) return;
    try {
      if (searchControllerRef.current) {
        try { searchControllerRef.current.abort(); } catch (e) {}
      }
      const controller = new AbortController();
      searchControllerRef.current = controller;
      setCloudLoading(true);
      const url = `${GOOGLE_SCRIPT_URL}?action=getProducts${q ? `&q=${encodeURIComponent(q)}` : ''}&_=${Date.now()}`;
      const res = await fetch(url, { signal: controller.signal });
      const json = await res.json();
      const list = (json?.data || json || []);
      const mapped = Array.isArray(list) ? list.slice(0, 200).map(p => ({
        id: p.id || p.productId || p.name || generateId(),
        name: p.name || p.productName || p['ชื่อสินค้า'] || '',
        active: p.activeIngredient || p.active || p['active'] || p['สารสำคัญ'] || '',
      
      })) : [];
      setCloudChemicals(mapped);
    } catch (e) {
      if (e.name === 'AbortError') return;
      console.error('fetchCloudProducts error', e);
    } finally {
      setCloudLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (chemicalSearch && chemicalSearch.length >= 2) {
      searchTimerRef.current = setTimeout(() => fetchCloudProducts(chemicalSearch), 300);
    } else if (chemicalSearch === '') {
      setCloudChemicals([]);
    }
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [chemicalSearch]);
  const filteredData = useMemo(() => {
    return safeData.filter(item => 
      (filterOrchard === 'ทั้งหมด' || item.orchard === filterOrchard) &&
      (filterType === 'ทั้งหมด' || item.type === filterType)
    ).sort((a, b) => dateToValue(b.date) - dateToValue(a.date));
  }, [safeData, filterOrchard, filterType]);

  const handleAddActivity = (e) => {
    e.preventDefault();
    const activity = { id: generateId(), ...newActivity, status: 'Pending' };
    // Resistance management check: warn if last spray for this orchard used the same chemical group
    if (newActivity.type === 'ฉีดยา' && newActivity.productGroup) {
      const previousSprays = (data || []).filter(a => a.orchard === newActivity.orchard && a.type === 'ฉีดยา');
      if (previousSprays.length) {
        const last = previousSprays.sort((a,b) => dateToValue(b.date) - dateToValue(a.date))[0];
        const lastGroup = last.productGroup || last.group || '';
        if (lastGroup && lastGroup === newActivity.productGroup) {
          setNotification({ message: 'เตือน: กลุ่มสารเคมีเดียวกับครั้งล่าสุด — ควรสลับกลุ่มเพื่อลดความต้านทาน', type: 'error' });
          setTimeout(() => setNotification(null), 5000);
        }
      }
    }

    const updatedData = [activity, ...data];
    setData(updatedData);
    setNewActivity({ ...newActivity, details: '', product: '', productActive: '', productGroup: '', dosage: '', unit: 'ml' });
    syncToCloud('saveMaintenance', updatedData, true);
  };
  const handleDeleteActivity = (id) => {
    const updatedData = data.filter(a => a.id !== id);
    setData(updatedData);
    syncToCloud('saveMaintenance', updatedData, true);
  };
  const getIcon = (type) => {
    switch (type) {
      case 'ฉีดยา': return <Droplets size={16} className="text-blue-500" />;
      case 'ใส่ปุ๋ย': return <Sprout size={16} className="text-green-500" />;
      case 'ตัดหญ้า': return <Leaf size={16} className="text-orange-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 mb-1">ตารางงานและการดูแล</h2>
           <p className="text-gray-500 text-sm">บันทึกกิจกรรมประจำวัน</p>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={onRefresh} className="p-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all">
            <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => syncToCloud('saveMaintenance', data, false)} disabled={isSyncing} className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium shadow-sm transition-all active:scale-95 ${isSyncing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isSyncing ? <Loader className="animate-spin" size={18} /> : <CloudUpload size={18} />}
            <span>บันทึกงาน</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <h3 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2"><Plus size={18} className="text-blue-500" /> เพิ่มกิจกรรมใหม่</h3>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
                <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={newActivity.date} onChange={(e) => setNewActivity({...newActivity, date: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สวน</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={newActivity.orchard} onChange={(e) => setNewActivity({...newActivity, orchard: e.target.value})}>
                  {ORCHARD_LIST.map(o => <option key={o.id}>{o.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">กิจกรรม</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_ACTIVITIES.map(type => (
                    <button key={type} type="button" onClick={() => setNewActivity({...newActivity, type})} className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${newActivity.type === type ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                      {type}
                    </button>
                  ))}
                  <button type="button" onClick={() => setNewActivity({...newActivity, type: ''})} className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${!PRESET_ACTIVITIES.includes(newActivity.type) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>อื่นๆ</button>
                </div>
                {!PRESET_ACTIVITIES.includes(newActivity.type) && (
                   <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all animate-in fade-in slide-in-from-top-1" placeholder="ระบุกิจกรรม (เช่น ตัดแต่งกิ่ง, โยงกิ่ง)" value={newActivity.type} onChange={(e) => setNewActivity({...newActivity, type: e.target.value})} required />
                )}
                {newActivity.type === 'ฉีดยา' && (
                  <div className="space-y-3">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">สารเคมีที่ใช้ (ค้นหาจาก Cloud)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="พิมพ์ชื่อสารเคมี..."
                          ref={chemicalInputRef}
                          value={chemicalSearch}
                          onChange={(e) => setChemicalSearch(e.target.value)}
                        />
                        <button type="button" onClick={() => fetchCloudProducts(chemicalSearch)} className="p-2 bg-white border rounded-md text-gray-600 hover:bg-gray-50" title="รีเฟรช">
                          <RefreshCcw size={16} />
                        </button>
                      </div>
                      {cloudLoading && <div className="text-sm text-gray-500 mt-1">กำลังค้นจาก Cloud...</div>}
                      {!cloudLoading && cloudChemicals.length === 0 && chemicalSearch.length >= 2 && (
                        <div className="text-sm text-gray-500 mt-1">ไม่พบบันทึกจาก Cloud</div>
                      )}
                      {cloudChemicals.length > 0 && (
                        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-2 max-h-56 overflow-auto shadow-lg">
                          {cloudChemicals.map(p => (
                            <button key={p.id || p.name} type="button" className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => {
                              const additional = [p.active && `สารสำคัญ: ${p.active}`, p.group && `กลุ่ม: ${p.group}`].filter(Boolean).join(' • ');
                              setNewActivity(prev => ({ ...prev, product: p.name, productActive: p.active || '', productGroup: p.group || '', details: prev.details ? `${p.name}${additional ? ` (${additional})` : ''} — ${prev.details}` : `${p.name}${additional ? ` (${additional})` : ''}` }));
                              setChemicalSearch(p.name);
                              setCloudChemicals([]);
                              try { chemicalInputRef.current?.blur(); } catch (e) {}
                            }}>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                                {(p.active || p.group) && (
                                  <span className="text-xs text-gray-500 mt-0.5 truncate">{p.active ? `สารสำคัญ: ${p.active}` : ''}{p.active && p.group ? ' • ' : ''}{p.group ? `กลุ่ม: ${p.group}` : ''}</span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                <textarea rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all" placeholder="รายละเอียด..." value={newActivity.details} onChange={(e) => setNewActivity({...newActivity, details: e.target.value})} required></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                <Save size={18} /> <span>บันทึกข้อมูล</span>
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-8">
           <div className="flex flex-col sm:flex-row justify-end items-center gap-2 mb-4">
               <div className="flex gap-2 w-full sm:w-auto">
                 <select className="bg-white border border-gray-200 text-sm text-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none" value={filterOrchard} onChange={e => setFilterOrchard(e.target.value)}>
                   <option value="ทั้งหมด">สวนทั้งหมด</option>
                   {ORCHARD_LIST.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                 </select>
                 <select className="bg-white border border-gray-200 text-sm text-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none" value={filterType} onChange={e => setFilterType(e.target.value)}>
                   <option value="ทั้งหมด">ประเภททั้งหมด</option>
                   {uniqueActivityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
               </div>
           </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
             <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-100">
               <div className="col-span-2">วันที่</div>
               <div className="col-span-3">สวน</div>
               <div className="col-span-2">ประเภท</div>
               <div className="col-span-2">รายละเอียด</div>
               <div className="col-span-1"></div>
             </div>
             {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                <Activity className="w-10 h-10 mb-2 opacity-20" /><p>ยังไม่มีกิจกรรมตามเงื่อนไข</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                  <div key={item.id} className="group grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-2 text-sm text-gray-600 font-medium">{formatToThaiDate(item.date)}</div>
                    <div className="col-span-3 text-sm text-gray-800 truncate font-medium">{item.orchard}</div>
                    <div className="col-span-2 flex items-center gap-2">{getIcon(item.type)}<span className="text-sm text-gray-700 font-medium truncate">{item.type}</span></div>
                    <div className="col-span-5 text-xs text-gray-600 truncate">{item.details}</div>
                    <div className="col-span-1 flex justify-end">
                       <button onClick={() => handleDeleteActivity(item.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1.5"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpensesTab = ({ data, setData, syncToCloud, isSyncing, onRefresh }) => {
  const [newExpense, setNewExpense] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    orchard: ORCHARD_LIST[0].name, 
    type: 'ค่าปุ๋ย', 
    amount: '', 
    details: '',
    caretaker: CARETAKER_LIST[0],
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [filterOrchard, setFilterOrchard] = useState('ทั้งหมด');
  const [filterType, setFilterType] = useState('ทั้งหมด');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const fileInputRef = useRef(null);

  // ดึงข้อมูลจาก Cloud เมื่อ component load
  useEffect(() => {
    if (!data || data.length === 0) {
      onRefresh();
    }
  }, []);

  const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);
  
  const filteredData = useMemo(() => {
    return safeData.filter(item => {
      const itemDateVal = dateToValue(item.date);
      const startVal = filterStartDate ? dateToValue(filterStartDate) : 0;
      const endVal = filterEndDate ? dateToValue(filterEndDate) : 99999999;
      
      return (filterOrchard === 'ทั้งหมด' || item.orchard === filterOrchard) &&
             (filterType === 'ทั้งหมด' || item.type === filterType) &&
             (itemDateVal >= startVal && itemDateVal <= endVal);
    }).sort((a, b) => dateToValue(b.date) - dateToValue(a.date));
  }, [safeData, filterOrchard, filterType, filterStartDate, filterEndDate]);

  const totalExpenses = useMemo(() => filteredData.reduce((sum, item) => sum + (safeParseFloat(item.amount) || 0), 0), [filteredData]);

  const expensesByOrchard = useMemo(() => {
    const grouped = {};
    filteredData.forEach(item => {
      const val = safeParseFloat(item.amount) || 0;
      grouped[item.orchard] = (grouped[item.orchard] || 0) + val;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const expensesByType = useMemo(() => {
    const grouped = {};
    filteredData.forEach(item => {
      const val = safeParseFloat(item.amount) || 0;
      grouped[item.type] = (grouped[item.type] || 0) + val;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const resizedBase64 = await resizeImage(file);
        setNewExpense({ ...newExpense, image: resizedBase64 });
        setPreview(resizedBase64);
      } catch (err) { alert("เกิดข้อผิดพลาดในการโหลดรูป"); }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const expenseItem = { ...newExpense, id: generateId(), amount: safeParseFloat(newExpense.amount) };
    const updated = [expenseItem, ...safeData];
    setData(updated);
    setNewExpense({...newExpense, amount: '', details: '', caretaker: CARETAKER_LIST[0], image: null});
    setPreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    syncToCloud('saveExpenses', updated, true);
  };

  const handleDelete = (id) => {
    const updated = safeData.filter(i => i.id !== id);
    setData(updated);
    syncToCloud('saveExpenses', updated, true);
  };

  const handleViewBillInNewWindow = (item) => {
    const rawUrl = item.image || item.billUrl || item['หลักฐาน'] || item['หลักฐานการจ่ายเงิน'];
    const imageUrl = getDirectImageUrl(rawUrl);
    
    if (!imageUrl) {
      alert("ไม่พบลิงก์รูปภาพในฐานข้อมูล");
      return;
    }

    const newWin = window.open("", "_blank");
    if (!newWin) {
      alert("โปรดอนุญาตให้เบราว์เซอร์เปิดหน้าต่าง Pop-up เพื่อดูรูปภาพหลักฐาน");
      return;
    }

    newWin.document.write(`
      <html>
        <head>
          <title>หลักฐานการจ่ายเงิน - ${item.orchard}</title>
          <style>
            body { 
              margin: 0; 
              background-color: #0b0f1a; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              overflow: hidden;
              font-family: 'Inter', sans-serif;
            }
            .img-wrapper {
              position: relative;
              max-width: 95%;
              max-height: 95%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            img { 
              max-width: 100%; 
              max-height: 100%; 
              object-fit: contain;
              box-shadow: 0 0 100px rgba(0,0,0,0.9);
              border-radius: 4px;
            }
            .close-hint {
              position: fixed;
              bottom: 20px;
              color: rgba(255,255,255,0.4);
              font-size: 12px;
              pointer-events: none;
            }
          </style>
        </head>
        <body onclick="window.close()">
          <div class="img-wrapper">
            <img src="${imageUrl}" alt="Bill Evidence" onerror="alert('ไม่สามารถโหลดรูปภาพได้\\nกรุณาตรวจสอบการแชร์ไฟล์ใน Google Drive หรือสิทธิ์การเข้าถึง')">
          </div>
          <div class="close-hint">คลิกตรงไหนก็ได้เพื่อปิด</div>
        </body>
      </html>
    `);
    newWin.document.close();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 mb-1">บันทึกค่าใช้จ่าย</h2>
           <p className="text-gray-500 text-sm">ควบคุมต้นทุนและค่าใช้จ่ายในสวน</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">รายจ่ายรวม</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-red-600">฿{totalExpenses.toLocaleString()}</p>
                <div className="bg-red-100 p-1 rounded-full"><ArrowUpRight size={14} className="text-red-600" /></div>
              </div>
           </div>
           <button onClick={() => syncToCloud('saveExpenses', data, false)} className="p-3 rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-red-50 hover:text-red-600 transition-all active:scale-95">
             <CloudUpload size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2 animate-in fade-in slide-in-from-top-4 duration-500">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
             <div className="flex justify-between items-center mb-5">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   <div className="bg-green-100 p-1.5 rounded-lg text-green-600"><MapPin size={18} /></div>
                   สรุปรายจ่ายตามสวน
               </h3>
             </div>
             <div className="space-y-4 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                 {expensesByOrchard.length === 0 ? <p className="text-gray-400 text-xs text-center py-6">ไม่มีข้อมูล</p> : 
                     expensesByOrchard.map((item, idx) => (
                         <div key={idx} className="group">
                             <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-700 font-semibold">{item.name}</span><span className="font-black text-gray-900">฿{item.value.toLocaleString()}</span></div>
                             <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                 <div className="bg-green-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0}%` }}></div>
                             </div>
                         </div>
                     ))
                 }
             </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
             <div className="flex justify-between items-center mb-5">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600"><PieChart size={18} /></div>
                   สรุปรายจ่ายตามหมวดหมู่
               </h3>
             </div>
             <div className="space-y-4 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                  {expensesByType.length === 0 ? <p className="text-gray-400 text-xs text-center py-6">ไม่มีข้อมูล</p> : 
                     expensesByType.map((item, idx) => (
                         <div key={idx} className="group">
                             <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-700 font-semibold">{item.type || item.name}</span><span className="font-black text-gray-900">฿{item.value.toLocaleString()}</span></div>
                             <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div className="bg-blue-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0}%` }}></div>
                             </div>
                         </div>
                     ))
                 }
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
              <h3 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2"><Plus size={18} className="text-red-500" /> เพิ่มรายจ่าย</h3>
              <form onSubmit={handleSave} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">วันที่จ่าย</label>
                   <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} required />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">สวน</label>
                   <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" value={newExpense.orchard} onChange={e => setNewExpense({...newExpense, orchard: e.target.value})}>
                     {ORCHARD_LIST.map(o => <option key={o.id}>{o.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                   <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" value={newExpense.type} onChange={e => setNewExpense({...newExpense, type: e.target.value})}>
                     {EXPENSE_TYPES.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                   </select>
                 </div>
                 {newExpense.type === 'เบิกเงิน' && (
                    <div className="animate-in fade-in slide-in-from-top-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">ผู้เบิกเงิน</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" value={newExpense.caretaker} onChange={e => setNewExpense({...newExpense, caretaker: e.target.value})}>
                        {CARETAKER_LIST.map((name, index) => <option key={index} value={name}>{name}</option>)}
                      </select>
                    </div>
                 )}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                   <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="รายละเอียด..." value={newExpense.details} onChange={e => setNewExpense({...newExpense, details: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">แนบรูปบิล (ถ้ามี)</label>
                   <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <CloudUpload className="w-8 h-8 mb-2 text-gray-400" /><p className="text-xs text-gray-500">คลิกเพื่ออัปโหลดรูป</p>
                          </div>
                          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                   </div>
                   {preview && (
                      <div className="mt-2 relative group animate-in zoom-in-95">
                        <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                        <button type="button" onClick={() => { setPreview(null); setNewExpense({...newExpense, image: null}); if(fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-red-500 hover:text-white transition-all"><X size={16} /></button>
                      </div>
                   )}
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน (บาท)</label>
                   <input type="number" placeholder="0.00" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} required />
                 </div>
                 <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-all">ยืนยันบันทึกจ่ายเงิน</button>
              </form>
            </div>
         </div>
         <div className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
               <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><History size={20} className="text-gray-400" /> ประวัติรายจ่าย</h3>
               <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                 <div className="flex items-center gap-2 flex-1 sm:flex-none">
                   <input type="date" className="bg-white border border-gray-200 text-[10px] text-gray-600 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-red-500 outline-none w-full sm:w-auto" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} />
                   <span className="text-gray-400">-</span>
                   <input type="date" className="bg-white border border-gray-200 text-[10px] text-gray-600 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-red-500 outline-none w-full sm:w-auto" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} />
                 </div>
                 <select className="bg-white border border-gray-200 text-xs text-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 outline-none flex-1 sm:flex-none" value={filterOrchard} onChange={e => setFilterOrchard(e.target.value)}>
                   <option value="ทั้งหมด">สวนทั้งหมด</option>
                   {ORCHARD_LIST.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                 </select>
                 <select className="bg-white border border-gray-200 text-xs text-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 outline-none flex-1 sm:flex-none" value={filterType} onChange={e => setFilterType(e.target.value)}>
                   <option value="ทั้งหมด">หมวดหมู่ทั้งหมด</option>
                   {EXPENSE_TYPES.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                 </select>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
               <div className="grid grid-cols-12 gap-2 px-4 py-4 bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <div className="col-span-2">วันที่</div>
                  <div className="col-span-2">หมวดหมู่</div>
                  <div className="col-span-3">รายละเอียด</div>
                  <div className="col-span-2">สวน</div>
                  <div className="col-span-2 text-right">จำนวนเงิน</div>
                  <div className="col-span-1"></div>
               </div>
               
               {filteredData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400"><DollarSign size={40} className="opacity-10 mb-2" /><p>ยังไม่มีรายจ่ายตามเงื่อนไข</p></div>
               ) : (
                 <div className="divide-y divide-gray-100">
                   {filteredData.map(item => {
                      const typeInfo = EXPENSE_TYPES.find(t => t.name === item.type) || EXPENSE_TYPES[4];
                      const Icon = typeInfo.icon;
                      // Determine if there is an image
                      const hasImage = !!(item.image || item.billUrl || item['หลักฐาน'] || item['หลักฐานการจ่ายเงิน']);
                      return (
                       <div key={item.id} className="group grid grid-cols-12 gap-2 px-4 py-4 items-center hover:bg-gray-50 transition-colors">
                         <div className="col-span-2 text-xs text-gray-600 font-medium">{formatToThaiDate(item.date)}</div>
                         <div className="col-span-2 flex items-center gap-2"><div className={`p-1 rounded-md ${typeInfo.color}`}>{Icon && <Icon size={12} />}</div><span className="text-xs text-gray-700 font-bold truncate">{item.type}</span></div>
                         <div className="col-span-3 text-xs text-gray-500 truncate">
                            {item.type === 'เบิกเงิน' && item.caretaker && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 mr-2 border border-blue-100">{item.caretaker}</span>
                            )}
                            {item.details}
                         </div>
                         <div className="col-span-2 text-xs text-gray-600 font-medium truncate">{item.orchard}</div>
                         <div className="col-span-2 text-right text-xs font-black text-red-600">-{item.amount?.toLocaleString()}</div>
                         <div className="col-span-1 flex justify-end items-center gap-2">
                            {/* Updated Logic: Consistent with fetchData mapping */}
                            {hasImage && (
                               <button 
                                  onClick={() => handleViewBillInNewWindow(item)} 
                                  className="text-blue-500 hover:text-white hover:bg-blue-500 bg-blue-50 p-1.5 rounded-lg transition-all" 
                                  title="เปิดดูบิลในหน้าต่างใหม่"
                                >
                                  <ImageIcon size={14} />
                                </button>
                            )}
                            <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1.5"><Trash2 size={14} /></button>
                         </div>
                       </div>
                      )
                   })}
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [aiAdvisorOpen, setAiAdvisorOpen] = useState(false);

  const syncToCloud = async (action, data, isAuto = false) => {
    if (!GOOGLE_SCRIPT_URL) return;
    setIsSyncing(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: action, data: data })
      });
      if (!isAuto) {
        setNotification({ message: 'บันทึกข้อมูลสำเร็จ', type: 'success' });
        fetchData();
      }
    } catch (error) { setNotification({ message: 'เกิดข้อผิดพลาดในการบันทึก', type: 'error' }); } finally {
      setIsSyncing(false);
      if (!isAuto) setTimeout(() => setNotification(null), 3000);
    }
  };

  const fetchData = async () => {
    setIsSyncing(true);
    setFetchError(null);
    try {
      const urls = [
        `${GOOGLE_SCRIPT_URL}?action=getSales&_=${Date.now()}`,
        `${GOOGLE_SCRIPT_URL}?action=getExpenses&_=${Date.now()}`,
        `${GOOGLE_SCRIPT_URL}?action=getMaintenance&_=${Date.now()}`,
        `${GOOGLE_SCRIPT_URL}?action=getProducts&_=${Date.now()}`
      ];
      const responses = await Promise.all(urls.map(url => fetch(url).then(res => res.json())));
      
      const mapItem = (item) => ({
        ...item,
        id: item.id || generateId(),
        date: normalizeDate(item.date || item['วันที่'] || ''),
        image: item.image || item.billUrl || item['หลักฐาน'] || item['หลักฐานการจ่ายเงิน'] || item['รูปภาพ'] || null,
        product: item.product || item.productName || item.name || item['ชื่อสินค้า'] || item['สินค้า'] || '',
        productActive: item.productActive || item.active || item.activeIngredient || item['สารสำคัญ'] || '',
        productGroup: item.productGroup || item.group || item.chemicalGroup || item['กลุ่มสารเคมี'] || ''
      });

      const sales = (responses[0]?.data || responses[0] || []).map(mapItem);
      const expenses = (responses[1]?.data || responses[1] || []).map(mapItem);
      const maintenance = (responses[2]?.data || responses[2] || []).map(mapItem);
      const products = (responses[3]?.data || responses[3] || []);
      
      setSalesData(sales);
      setExpensesData(expenses);
      setMaintenanceData(maintenance);
      setProductsData(products);
    } catch (e) { 
        console.error(e);
        setFetchError("เชื่อมต่อ Cloud ล้มเหลว"); 
    } finally {
      setIsSyncing(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const weatherData = useMemo(() => {
    const days = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const isRainy = i % 3 === 0; 
      return {
        day: days[nextDate.getDay()],
        date: nextDate.getDate(),
        temp: isRainy ? 28 + Math.floor(Math.random() * 3) : 32 + Math.floor(Math.random() * 4),
        icon: isRainy ? CloudRain : Sun,
        color: isRainy ? 'text-blue-500' : 'text-orange-400'
      };
    });
  }, []);

  const latestActivities = useMemo(() => {
    return ORCHARD_LIST.map(orchard => {
      const activities = maintenanceData
        .filter(m => m.orchard === orchard.name)
        .sort((a, b) => dateToValue(b.date) - dateToValue(a.date));
      return { ...orchard, latest: activities[0] || null };
    });
  }, [maintenanceData]);

  const notifications = useMemo(() => {
    if (!maintenanceData.length) return [];
    const alerts = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    ORCHARD_LIST.forEach(orchard => {
      const acts = maintenanceData.filter(m => m.orchard === orchard.name);
      const lastFert = acts.filter(a => a.type === 'ใส่ปุ๋ย').sort((a,b) => dateToValue(b.date) - dateToValue(a.date))[0];
      if(lastFert) {
        const nextDate = new Date(normalizeDate(lastFert.date));
        nextDate.setDate(nextDate.getDate() + 20);
        const diff = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        alerts.push({ id: `f-${orchard.id}`, orchard: orchard.name, type: 'ใส่ปุ๋ย', days: diff, date: nextDate });
      }
      const lastSpray = acts.filter(a => a.type === 'ฉีดยา').sort((a,b) => dateToValue(b.date) - dateToValue(a.date))[0];
      if(lastSpray) {
        const nextDate = new Date(normalizeDate(lastSpray.date));
        nextDate.setDate(nextDate.getDate() + 7);
        const diff = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        alerts.push({ id: `s-${orchard.id}`, orchard: orchard.name, type: 'ฉีดยา', days: diff, date: nextDate });
      }
    });
    return alerts.filter(a => a.days <= 3).sort((a,b) => a.days - b.days);
  }, [maintenanceData]);

  if(isInitialLoading) return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 flex-col gap-6">
      <div className="relative"><Loader className="animate-spin text-green-600" size={48} /></div>
      <p className="font-bold text-xl text-gray-700 tracking-tight">DURIAN PRO</p>
    </div>
  );

  return (
    <GeminiProvider>
      <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
        {notification && (
          <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'bg-gray-800 text-green-400' : 'bg-red-600 text-white'}`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span className="font-medium text-sm">{notification.message}</span>
          </div>
        )}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 p-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <div className="md:hidden"><button onClick={() => setSidebarOpen(true)} className="p-2 bg-gray-100 rounded-lg text-gray-600"><Menu size={20} /></button></div>
             <BrandBadge size="sm" />
             <h1 className="text-xl font-bold text-gray-800 tracking-tight uppercase italic">
               {activeTab === 'overview' ? 'ภาพรวม' : activeTab === 'harvest' ? 'การขาย' : activeTab === 'maintenance' ? 'ตารางงาน' : activeTab === 'expenses' ? 'รายจ่าย' : activeTab === 'Chemicals' ? 'สารเคมี' : activeTab === 'catalog' ? 'สินค้าเกษตร' : 'โรคพืช'}
             </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex flex-col text-right"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">สถานะ</p><p className="text-xs font-bold text-green-600">ออนไลน์</p></div>
             <button onClick={fetchData} className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
             </button>
             <button 
               onClick={() => setAiAdvisorOpen(true)}
               className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white border border-green-600 transition-all hover:shadow-lg"
               title="AI Advisor - ปรึกษาเกี่ยวกับการดูแลทุเรียนและโรคพืช"
             >
               <MessageSquare size={18} />
             </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 scroll-smooth">
          {activeTab === 'overview' && (
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
              {notifications.length > 0 && (
                <section className="animate-in slide-in-from-top-4 duration-500">
                  <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2"><Bell size={20} className="text-red-500 fill-red-100"/> แจ้งเตือนงานด่วน</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notifications.map((note) => {
                       let statusColor = 'bg-blue-50 border-blue-100 text-blue-700';
                       let statusText = `อีก ${note.days} วัน`;
                       if (note.days < 0) {
                          statusColor = 'bg-red-50 border-red-100 text-red-700';
                          statusText = `เลยกำหนด ${Math.abs(note.days)} วัน`;
                       } else if (note.days === 0) {
                          statusColor = 'bg-orange-50 border-orange-100 text-orange-700';
                          statusText = 'วันนี้';
                       }
                       return (
                         <div key={note.id} className={`p-4 rounded-xl border flex justify-between items-center shadow-sm ${statusColor}`}>
                            <div className="flex items-center gap-3"><div className={`p-2 rounded-lg bg-white/60`}>{note.type === 'ใส่ปุ๋ย' ? <Sprout size={20} /> : <Droplets size={20} />}</div><div><p className="font-bold text-sm">{note.orchard}</p><p className="text-xs opacity-80">{note.type}</p></div></div>
                            <span className="text-xs font-bold bg-white/60 px-2 py-1 rounded-md">{statusText}</span>
                         </div>
                       );
                    })}
                  </div>
                </section>
              )}
              <section>
                <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2"><Cloud size={20} className="text-blue-500"/> พยากรณ์อากาศ 7 วัน (กรุงชิง)</h3>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                   <div className="flex justify-between min-w-[600px] gap-4">
                      {weatherData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center justify-center flex-1 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                           <span className="text-xs font-medium text-gray-500 mb-2">{d.day} {d.date}</span>
                           <d.icon size={28} className={`mb-2 ${d.color}`} />
                           <span className="text-lg font-bold text-gray-800">{d.temp}°</span>
                        </div>
                      ))}
                   </div>
                </div>
              </section>
              <section>
                 <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2"><Activity size={20} className="text-green-500"/> สถานะล่าสุดแต่ละแปลง</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {latestActivities.map(item => (
                       <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                             <div><h4 className="font-bold text-gray-800">{item.name}</h4><p className="text-xs text-gray-500">{item.area}</p></div>
                             <div className="bg-green-50 p-1.5 rounded-lg"><Leaf size={16} className="text-green-600" /></div>
                          </div>
                          <div className="pt-4 border-t border-gray-100">
                             {item.latest ? (
                                <div className="space-y-2">
                                   <div className="flex items-center gap-2 text-sm font-medium text-gray-700"><span className={`w-2 h-2 rounded-full ${item.latest.type === 'ฉีดยา' ? 'bg-blue-500' : item.latest.type === 'ใส่ปุ๋ย' ? 'bg-green-500' : 'bg-orange-500'}`}></span>{item.latest.type}</div>
                                   <p className="text-xs text-gray-500 truncate">{item.latest.details}</p>
                                   <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock size={10} /> {formatToThaiDate(item.latest.date)}</p>
                                </div>
                             ) : <div className="text-center py-2 text-gray-400 text-xs">ยังไม่มีกิจกรรม</div>}
                          </div>
                       </div>
                    ))}
                 </div>
              </section>
            </div>
          )}
          {activeTab === 'catalog' && <CatalogTab data={productsData} setData={setProductsData} syncToCloud={syncToCloud} isSyncing={isSyncing} onRefresh={fetchData} />}
          {activeTab === 'harvest' && <HarvestTab data={salesData} setData={setSalesData} syncToCloud={syncToCloud} isSyncing={isSyncing} onRefresh={fetchData} fetchError={fetchError} />}
          {activeTab === 'maintenance' && <MaintenanceTab data={maintenanceData} setData={setMaintenanceData} syncToCloud={syncToCloud} isSyncing={isSyncing} onRefresh={fetchData} fetchError={fetchError} />}
          {activeTab === 'expenses' && <ExpensesTab data={expensesData} setData={setExpensesData} syncToCloud={syncToCloud} isSyncing={isSyncing} onRefresh={fetchData} />}
          {activeTab === 'Chemicals' && <ChemicalsTab />}
          {activeTab === 'Fungicides' && <FungicidesTab />}
        </main>
        </div>
      </div>
      <AIAdvisor isOpen={aiAdvisorOpen} onClose={() => setAiAdvisorOpen(false)} />
    </GeminiProvider>
  );
};

export default App;