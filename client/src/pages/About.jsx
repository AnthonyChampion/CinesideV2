import React from 'react';

export default function About() {
    return (
        <div className="bg-zinc-900 text-white min-h-screen w-screen flex flex-col items-center">
            <header className="w-full py-8">
                <h1 className="text-4xl font-bold text-center">A propos</h1>
            </header>
            <main className="flex flex-col items-center py-10 px-4 md:px-20">
                <section className="max-w-4xl text-center">
                    <h2 className="text-2xl font-semibold mb-4">Pourquoi Cineside ?</h2>
                    <p className="text-lg leading-relaxed">
                        Welcome to Inside, your ultimate destination for all things movies!
                        We are passionate about cinema and dedicated to bringing you the latest
                        news, reviews, and insights from the film industry.
                    </p>
                </section>
                <section className="max-w-4xl text-center mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                    <p className="text-lg leading-relaxed">
                        Our mission is to provide movie enthusiasts with a comprehensive platform
                        to explore, discover, and share their love for films. Whether you're looking
                        for the latest blockbusters or hidden gems, we've got you covered.
                    </p>
                </section>
                <section className="max-w-4xl text-center mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Meet the Team</h2>
                    <div className="flex flex-wrap justify-center">
                        <div className="w-60 m-4">
                            <img src="https://via.placeholder.com/150" alt="Team Member" className="rounded-full mb-4" />
                            <h3 className="text-xl font-semibold">John Doe</h3>
                            <p className="text-sm">Founder & CEO</p>
                        </div>
                        <div className="w-60 m-4">
                            <img src="https://via.placeholder.com/150" alt="Team Member" className="rounded-full mb-4" />
                            <h3 className="text-xl font-semibold">Jane Smith</h3>
                            <p className="text-sm">Chief Editor</p>
                        </div>
                        <div className="w-60 m-4">
                            <img src="https://via.placeholder.com/150" alt="Team Member" className="rounded-full mb-4" />
                            <h3 className="text-xl font-semibold">Emily Johnson</h3>
                            <p className="text-sm">Lead Developer</p>
                        </div>
                    </div>
                </section>
                <section className="max-w-4xl text-center mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                    <p className="text-lg leading-relaxed">
                        Have any questions or feedback? Feel free to <a href="mailto:info@inside.com" className="text-blue-500 hover:underline">get in touch</a> with us.
                    </p>
                </section>
            </main>
        </div>
    );
}
