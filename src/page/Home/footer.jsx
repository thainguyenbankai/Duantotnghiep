import { FaFacebookF, FaInstagram, FaTiktok, FaLocationDot, FaPhone, FaEnvelope } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-[#2f2f2f] text-white py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h2 className="text-base font-semibold mb-2"><img src="https://file.hstatic.net/200000584505/file/137_x_42_px_28a4499b7dc045caab7996ef0fab24d4.png" alt="" /></h2>
          <p className="mb-3 leading-relaxed">
            J-P Fashion là thương hiệu thời trang nữ phong cách đa dạng với hàng nghìn mẫu thiết kế.
            Nơi các xu hướng thời trang trên thế giới được cập nhật mỗi ngày.
          </p>
          <p className="flex items-start gap-2 mb-1"><FaLocationDot className="mt-1" /> 889 Cách Mạng Tháng Tám, P.7, Q.Tân Bình, Tp. Hồ Chí Minh</p>
          <p className="flex items-center gap-2 mb-1"><FaPhone /> 0916305533</p>
          <p className="flex items-center gap-2"><FaEnvelope /> salesonline@j-p.vn</p>
          <img
            src=""
            alt="Bộ Công Thương"
            className="h-10 mt-3"
          />
        </div>

        <div>
          <h2 className="text-base font-semibold mb-2">Liên kết</h2>
          <ul className="space-y-1">
            <li>Bảo mật thông tin</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách giao hàng</li>
            <li>Chính sách kiểm hàng</li>
            <li>Điều khoản & Dịch vụ</li>
            <li>Phương thức thanh toán</li>
            <li>Chương trình khách hàng thân thiết</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold mb-2">Fanpage</h2>
          <iframe
            title="facebook-page"
            src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/jpfashion.vn&tabs=timeline&width=280&height=150&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
            width="100%"
            height="150"
            style={{ border: 'none', overflow: 'hidden' }}
            allow="encrypted-media"
          />
        </div>

        {/* Cột 4: Đăng ký nhận khuyến mãi */}
        <div>
          <h2 className="text-base font-semibold mb-2">Đăng ký nhận khuyến mãi</h2>
          <p className="mb-3">Hãy là người đầu tiên nhận khuyến mãi lớn!</p>
          <div className="flex mb-4">
            <input
              type="email"
              placeholder="Email"
              className="p-2 flex-1 text-black rounded-l"
            />
            <button className="bg-black text-white px-4 rounded-r">ĐĂNG KÝ</button>
          </div>
          <div className="flex gap-4 text-lg">
            <a href="#"><FaTiktok /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebookF /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
