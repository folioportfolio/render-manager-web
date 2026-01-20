import logo from "@/assets/logo.webp";

export default function SplashView() {
    return (
        <>
            <div className="flex items-center justify-center w-full h-full">
                <img className="my-2 h-32 self-start" src={logo} alt="Render Status Logo" />
            </div>
        </>
    );
}