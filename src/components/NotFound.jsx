import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    const [secondsLeft, setSecondsLeft] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        const redirectTimeout = setTimeout(() => {
            navigate('/');
        }, 30000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [navigate]);

    return (
        <section className="min-h-screen flex flex-col justify-center items-center px-4 py-16 text-center">
          <div className="relative flex justify-center items-center gap-20 w-full max-w-2xl h-72 md:h-96 mb-10 z-10">
    <h1 className="text-black text-[160px] md:text-[220px] font-extrabold drop-shadow-lg">4</h1>

    <img
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="404"
        className="w-full h-full object-cover rounded-xl max-w-[300px] md:max-w-[400px]"
    />

    <h1 className="text-black text-[160px] md:text-[220px] font-extrabold drop-shadow-lg">4</h1>
</div>

            <div className="max-w-lg">
                <p className="text-gray-600">
                    Không tìm thấy trang<br />
                    Trang sẽ tự động chuyển về trang chủ sau <span className="text-black font-semibold">{secondsLeft}</span> giây.<br />
                    <Link to="/" className="text-red-500">Hoặc nhấn vào đây để quay lại</Link>
                </p>
            </div>
        </section>
    );
};

export default NotFound;
