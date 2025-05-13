import Link from "next/link";
import PrimaryButton from "./components/PrimaryButton";

export default function NotFound() {
  return (
    <section className="std page_404 h-screen">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center std flex-col">
              <div className="four_zero_four_bg w-2/3 self-center">
                <h1 className="text-center mb-8 text-darkGreen animate-bounce font-extrabold">404</h1>
              </div>

              <div className="contant_box_404 std flex-col">
                <h3 className="h2">Look like you're lost</h3>

                <p>the page you are looking for not avaible!</p>

                <div className="py-8 w-full self-center">
                <Link
              href="/landing"
              className={`px-12 py-2 backdrop-blur-sm border-[1px] border-brokenWhite bg-darkGreen text-brokenWhite rounded-lg hover:bg-pine hover:border-parrot duration-300 font-medium`}
            >
             Go Back
            </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
