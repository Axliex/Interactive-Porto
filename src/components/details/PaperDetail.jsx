import React, { useState } from 'react';
import { PROFILE, ABOUT_SECTIONS, RESUME } from '../../data/profileData';
import { User, FileText, ChevronDown, ChevronRight, Download, Sparkles, GraduationCap, Briefcase, Award, Code2 } from 'lucide-react';

export default function PaperDetail() {
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'resume'
  const [expandedSection, setExpandedSection] = useState('pendidikan'); // 'pendidikan' | 'pengalaman' | 'sertifikasi' | null

  const toggleSection = (id) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-auto animate-fade-in text-white py-4 px-2 select-none">
      {/* Profile Header Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/15 shadow-2xl mb-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Profile Photo */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-xl flex-shrink-0">
            <img
              src={PROFILE.photo}
              alt={PROFILE.name}
              className="w-full h-full object-cover filter brightness-105"
            />
          </div>

          {/* Name & Role */}
          <div className="flex-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extralight mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Profil & Resume</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-normal text-white mb-1">
              {PROFILE.name}
            </h1>
            <p className="text-xs sm:text-sm font-extralight text-amber-200/90 mb-3">
              {PROFILE.role}
            </p>

            {/* Tab Buttons */}
            <div className="flex items-center justify-center sm:justify-start space-x-3 pt-2">
              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-normal transition-all cursor-pointer ${
                  activeTab === 'about'
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-300'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>About Me</span>
              </button>

              <button
                onClick={() => setActiveTab('resume')}
                className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-normal transition-all cursor-pointer ${
                  activeTab === 'resume'
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TAB CONTENT 1: ABOUT ME */}
      {activeTab === 'about' && (
        <div className="space-y-4 animate-fade-in">
          {/* Bio Box */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h3 className="text-xs font-extralight uppercase tracking-widest text-neutral-400 mb-2">
              Tentang Saya
            </h3>
            <p className="text-sm font-extralight text-neutral-200 leading-relaxed">
              {PROFILE.about}
            </p>
          </div>

          {/* Accordion Sections: Pendidikan, Pengalaman, Sertifikasi */}
          <div className="space-y-2.5">
            {ABOUT_SECTIONS.map((sec) => {
              const isExpanded = expandedSection === sec.id;
              return (
                <div
                  key={sec.id}
                  className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleSection(sec.id)}
                    className="w-full p-4 px-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{sec.emoji}</span>
                      <span className="text-sm font-normal text-white">{sec.label}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-extralight text-neutral-400">
                      <span className="hidden sm:inline">
                        {isExpanded ? 'Tutup detail' : 'Klik untuk membaca selengkapnya'}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Accordion Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-3 animate-fade-in">
                      {sec.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5"
                        >
                          <div className="flex items-baseline justify-between mb-1">
                            <h4 className="text-xs sm:text-sm font-normal text-white">
                              {item.title}
                            </h4>
                            <span className="text-[11px] font-extralight text-amber-300/80">
                              {item.period}
                            </span>
                          </div>
                          <p className="text-xs font-extralight text-neutral-300 leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Skill Learning Chips */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2 text-xs font-extralight uppercase tracking-widest text-neutral-400 mb-3">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Hal Baru yang Sedang Saya Pelajari</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PROFILE.learning.map((item, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-extralight text-neutral-200 flex items-center space-x-1.5 transition-colors"
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: RESUME */}
      {activeTab === 'resume' && (
        <div className="space-y-4 animate-fade-in">
          {/* Summary */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h3 className="text-xs font-extralight uppercase tracking-widest text-neutral-400 mb-2">
              Ringkasan Profesional
            </h3>
            <p className="text-sm font-extralight text-neutral-200 leading-relaxed">
              {RESUME.summary}
            </p>
          </div>

          {/* 2 Columns: Pendidikan & Pengalaman */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pendidikan */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-extralight uppercase tracking-widest text-amber-400 mb-3">
                  <GraduationCap className="w-4 h-4" />
                  <span>Pendidikan</span>
                </div>
                {RESUME.education.map((edu, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="text-xs sm:text-sm font-normal text-white">{edu.title}</div>
                    <div className="text-xs font-extralight text-neutral-400">{edu.place}</div>
                    <div className="text-[11px] font-extralight text-neutral-500">{edu.year}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pengalaman */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-extralight uppercase tracking-widest text-amber-400 mb-3">
                  <Briefcase className="w-4 h-4" />
                  <span>Pengalaman</span>
                </div>
                {RESUME.experience.map((exp, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="text-xs sm:text-sm font-normal text-white">{exp.title}</div>
                    <div className="text-xs font-extralight text-neutral-400">{exp.place}</div>
                    <div className="text-[11px] font-extralight text-neutral-500">{exp.year}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Badges */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h3 className="text-xs font-extralight uppercase tracking-widest text-neutral-400 mb-3">
              Keahlian & Perangkat Lunak
            </h3>
            <div className="flex flex-wrap gap-2">
              {RESUME.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-extralight text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Download Resume Action */}
          <div className="flex justify-end pt-2">
            <a
              href="mailto:isalikhwan165@gmail.com"
              className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-normal flex items-center space-x-2 transition-all shadow-lg cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Hubungi / Unduh Resume Lengkap</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
