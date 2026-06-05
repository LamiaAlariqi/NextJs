import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  const teamMembers = [
    {
      name: "لارا احمد",
      role: "المؤسس والمدير التنفيذي",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "أحمد محمد",
      role: "مدير العمليات والتقنية",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "سارة خالد",
      role: "مسؤولة تجربة العملاء",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Container */}
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 md:p-16 shadow-2xl border border-indigo-800/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_50%)]"></div>
          <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              ✨ قصة نجاحنا
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
              من نحن؟
            </h1>
            <p className="text-md md:text-lg text-slate-300 leading-relaxed font-light">
              نحن متجر إلكتروني رائد نسعى لتقديم أفضل المنتجات وأعلى جودة بأفضل الأسعار التنافسية. نؤمن بأن التسوق الإلكتروني يجب أن يكون تجربة ممتعة، سهلة، وآمنة للجميع.
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-base-200/50 backdrop-blur-md p-8 rounded-3xl border border-base-300 hover:border-indigo-500/30 transition-all hover:-translate-y-1 duration-300 text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              🎯
            </div>
            <h3 className="text-xl font-bold">رؤيتنا</h3>
            <p className="text-base-content/70 text-sm leading-relaxed">
              أن نكون الخيار الأول والوجهة الموثوقة للتسوق الإلكتروني في المنطقة من خلال تقديم تجربة عملاء استثنائية.
            </p>
          </div>

          <div className="bg-base-200/50 backdrop-blur-md p-8 rounded-3xl border border-base-300 hover:border-indigo-500/30 transition-all hover:-translate-y-1 duration-300 text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              💎
            </div>
            <h3 className="text-xl font-bold">قيمنا</h3>
            <p className="text-base-content/70 text-sm leading-relaxed">
              الجودة، الأمانة، والشفافية. نضع رضاء عملائنا في مقدمة أولوياتنا ونسعى دائماً لتجاوز توقعاتهم.
            </p>
          </div>

          <div className="bg-base-200/50 backdrop-blur-md p-8 rounded-3xl border border-base-300 hover:border-indigo-500/30 transition-all hover:-translate-y-1 duration-300 text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              🚀
            </div>
            <h3 className="text-xl font-bold">مهمتنا</h3>
            <p className="text-base-content/70 text-sm leading-relaxed">
              توفير تشكيلة واسعة من المنتجات المتميزة مع خدمات شحن سريعة ودعم فني متواصل على مدار الساعة.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">فريق العمل</h2>
            <p className="text-base-content/60 max-w-md mx-auto text-sm">
              نخبة من الشغوفين والمبدعين الذين يعملون خلف الكواليس لتقديم أفضل تجربة تسوق لك.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-base-100 rounded-3xl overflow-hidden border border-base-200 shadow-sm text-center group">
                <div className="relative overflow-hidden h-64 bg-base-300">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-white text-xs font-medium bg-indigo-600 px-3 py-1 rounded-full">
                      تواصل معنا
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-1">
                  <h4 className="text-lg font-bold text-base-content">{member.name}</h4>
                  <p className="text-sm text-base-content/60">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-600/10 rounded-3xl p-8 md:p-12 text-center border border-indigo-500/20 space-y-6">
          <h3 className="text-2xl font-bold">هل لديك أي استفسار أو ترغب في التعاون معنا؟</h3>
          <p className="text-base-content/80 max-w-lg mx-auto text-sm">
            يسعدنا دائماً الاستماع إلى آرائكم ومقترحاتكم. تواصل معنا في أي وقت وسنقوم بالرد عليك في أقرب وقت ممكن.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="btn btn-primary bg-indigo-600 hover:bg-indigo-500 border-none rounded-2xl text-white font-bold px-8 shadow-lg shadow-indigo-500/25">
              صفحة اتصل بنا
            </Link>
            <Link to="/" className="btn btn-ghost border border-base-300 hover:border-indigo-600 rounded-2xl px-8">
              الرجوع للمتجر
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
