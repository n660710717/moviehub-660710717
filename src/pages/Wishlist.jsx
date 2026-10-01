// ขั้นที่ 4: import useEffect, useState และ getWishlist
import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { useAuth } from '../auth/AuthContext';
import { getWishlist } from '../api/backend';

// หน้า "รายการที่อยากดู" ของสมาชิกที่ login อยู่ (เส้นทาง /me/wishlist ครอบด้วย ProtectedRoute แล้ว)
function Wishlist() {
  // ขั้นที่ 4: ดึง token มาด้วย เพื่อใช้ส่งไปยืนยันตัวตนกับ API
  const { member, token } = useAuth();                  

  // ขั้นที่ 4: เปลี่ยน 3 ค่าคงที่เป็น state
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('loading'); // เริ่มต้นด้วยสถานะ loading
  const [error, setError] = useState(null);

  // ขั้นที่ 4: โหลดข้อมูลด้วย useEffect
  useEffect(() => {
    async function fetchWishlist() {
      if (!token) return; // ป้องกันกรณี token ยังไม่มา
      
      try {
        setStatus('loading');
        // เรียก API เพื่อดึงข้อมูล wishlist
        const list = await getWishlist(token);
        
        // เซ็ตข้อมูลหนังที่ได้จาก API (list.items) ลงใน state
        setMovies(list.items || []); 
        setStatus('success');
      } catch (err) {
        setError(err.message || 'ไม่สามารถดึงข้อมูลรายการที่อยากดูได้');
        setStatus('error');
      }
    }

    fetchWishlist();
  }, [token]); // dependency คือ [token] เพื่อให้ดึงข้อมูลใหม่ถ้า token เปลี่ยน

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">รายการที่อยากดูของ {member?.displayName}</h1>
      <p className="mb-6 text-sm text-slate-500">กดปุ่มหัวใจในหน้าหนังเพื่อเพิ่มเรื่องเข้ามาที่นี่</p>
      <MovieGrid movies={movies} status={status} error={error} />
    </div>
  );
}

export default Wishlist;