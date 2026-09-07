import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Printer, 
  Download, 
  CheckCircle, 
  User, 
  Shield, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Loader2, 
  FileText,
  UserCheck
} from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const StorySprintPassport: React.FC = () => {
  const { 
    participants, 
    hero, 
    world, 
    storyTitle, 
    batonHistory, 
    achievements, 
    className,
    addParticipant,
    removeParticipant,
    renameParticipant
  } = useStoryState();
  
  const { playTap, playFanfare } = useAudio();
  const [selectedStudent, setSelectedStudent] = useState<string>(participants[0] || 'Team Alpha');
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamInput, setNewTeamInput] = useState('');
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editTeamInput, setEditTeamInput] = useState('');
  const [isExporting, setIsExporting] = useState<'png' | 'pdf' | null>(null);

  const passportCardRef = useRef<HTMLDivElement>(null);

  // Filter contributions by selected participant
  const studentPasses = batonHistory.filter(
    b => b.toHolder === selectedStudent || b.fromHolder === selectedStudent
  );

  // Add custom team name
  const handleCreateTeam = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTeamInput.trim();
    if (!trimmed) return;
    playTap();
    addParticipant(trimmed);
    setSelectedStudent(trimmed);
    setNewTeamInput('');
    setIsAddingTeam(false);
  };

  // Rename selected team name
  const handleSaveRename = () => {
    const trimmed = editTeamInput.trim();
    if (!trimmed || trimmed === selectedStudent) {
      setIsEditingTeam(false);
      return;
    }
    playTap();
    renameParticipant(selectedStudent, trimmed);
    setSelectedStudent(trimmed);
    setIsEditingTeam(false);
  };

  // Delete team
  const handleDeleteTeam = (teamName: string) => {
    if (participants.length <= 1) {
      alert('You must keep at least one team in the adventure!');
      return;
    }
    if (confirm(`Remove "${teamName}" from the team roster?`)) {
      playTap();
      removeParticipant(teamName);
      const remaining = participants.filter(p => p !== teamName);
      setSelectedStudent(remaining[0] || 'Team Alpha');
    }
  };

  // 🖼️ Download ONLY the Passport Card as High-Resolution PNG
  const handleDownloadPassportPNG = async () => {
    if (!passportCardRef.current || isExporting) return;
    setIsExporting('png');
    playFanfare();

    try {
      const cardElement = passportCardRef.current;
      const canvas = await html2canvas(cardElement, {
        scale: 3, // Ultra-sharp 300 DPI credential quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const safeTeamName = selectedStudent.replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `${safeTeamName}_Passport_Credential.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error('Passport PNG download failed', err);
      alert('Could not download passport image. Falling back to print.');
      window.print();
    } finally {
      setIsExporting(null);
    }
  };

  // 📄 Download ONLY the Passport Card as Standalone PDF Card
  const handleDownloadPassportPDF = async () => {
    if (!passportCardRef.current || isExporting) return;
    setIsExporting('pdf');
    playFanfare();

    try {
      const cardElement = passportCardRef.current;
      const canvas = await html2canvas(cardElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      // Landscape single page credential card
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 297;
      const pdfHeight = 210;
      const cardAspect = canvas.width / canvas.height;
      
      let renderWidth = pdfWidth - 24;
      let renderHeight = renderWidth / cardAspect;

      if (renderHeight > pdfHeight - 24) {
        renderHeight = pdfHeight - 24;
        renderWidth = renderHeight * cardAspect;
      }

      const x = (pdfWidth - renderWidth) / 2;
      const y = (pdfHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);
      const safeTeamName = selectedStudent.replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${safeTeamName}_Passport_Credential.pdf`);
    } catch (err) {
      console.error('Passport PDF download failed', err);
      window.print();
    } finally {
      setIsExporting(null);
    }
  };

  // Direct Print
  const handlePrint = () => {
    playFanfare();
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* ── 🏷️ TEAM SELECTION & CUSTOM TEAM MANAGEMENT TOOLBAR ── */}
      <div className="flex flex-col gap-4 bg-white/95 backdrop-blur-xl p-5 rounded-3xl border-2 border-amber-300 shadow-lg print:hidden">
        
        {/* Row 1: Header and Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs">
              🎖️
            </div>
            <div>
              <span className="text-[10px] font-nunito font-black uppercase text-amber-800 tracking-wider block">
                Classroom Storyteller Credential
              </span>
              <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                Team Story Sprint Passports
              </h3>
            </div>
          </div>

          {/* Download & Print Buttons (Targeting ONLY the Passport Card) */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* 🖼️ Download PNG */}
            <button
              type="button"
              onClick={handleDownloadPassportPNG}
              disabled={isExporting !== null}
              className="btn-story-primary text-xs !min-h-[38px] !py-2 !bg-gradient-to-r !from-amber-500 !to-orange-500 flex items-center gap-1.5 shadow-sm text-white font-bold cursor-pointer disabled:opacity-50"
              title="Download only the passport card as high-res PNG image"
            >
              {isExporting === 'png' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExporting === 'png' ? 'Generating PNG...' : 'Download Card (PNG)'}</span>
            </button>

            {/* 📄 Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPassportPDF}
              disabled={isExporting !== null}
              className="btn-story-primary text-xs !min-h-[38px] !py-2 !bg-gradient-to-r !from-purple-600 !to-indigo-600 flex items-center gap-1.5 shadow-sm text-white font-bold cursor-pointer disabled:opacity-50"
              title="Download standalone passport card as PDF"
            >
              {isExporting === 'pdf' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              <span>{isExporting === 'pdf' ? 'Generating PDF...' : 'Download Card (PDF)'}</span>
            </button>

            {/* 🖨️ Print */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn-story-secondary text-xs !min-h-[38px] !py-2 flex items-center gap-1.5 bg-white hover:bg-amber-50 border border-amber-300 text-slate-800 font-bold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Row 2: Team Tabs & Custom Team Adder */}
        <div className="pt-3 border-t border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-nunito font-extrabold text-slate-700">
              Select or Customize Team / Student Name:
            </span>
            {!isAddingTeam && (
              <button
                type="button"
                onClick={() => { playTap(); setIsAddingTeam(true); }}
                className="text-xs font-nunito font-black text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-xl border border-purple-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Custom Team Name</span>
              </button>
            )}
          </div>

          {/* Quick Add Custom Team Input */}
          <AnimatePresence>
            {isAddingTeam && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateTeam}
                className="flex items-center gap-2 bg-purple-50/80 p-2.5 rounded-2xl border border-purple-200"
              >
                <input
                  type="text"
                  placeholder="Enter your custom team name (e.g. Team Dragon Fire, Chirag & Sam)..."
                  value={newTeamInput}
                  onChange={e => setNewTeamInput(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-white border border-purple-300 font-nunito font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newTeamInput.trim()}
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-nunito font-black text-xs cursor-pointer disabled:opacity-40"
                >
                  Save Team
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAddingTeam(false); setNewTeamInput(''); }}
                  className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Team Roster Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {participants.map(team => {
              const isSelected = selectedStudent === team;
              return (
                <div
                  key={team}
                  className={`inline-flex items-center rounded-xl transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/40'
                      : 'bg-slate-100 hover:bg-purple-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => { playTap(); setSelectedStudent(team); setIsEditingTeam(false); }}
                    className="px-3 py-1.5 text-xs font-display font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    {isSelected && <UserCheck className="w-3 h-3 text-amber-300" />}
                    <span>{team}</span>
                  </button>

                  {/* Actions for active team */}
                  {isSelected && (
                    <div className="flex items-center pr-1.5 gap-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditTeamInput(team);
                          setIsEditingTeam(true);
                        }}
                        className="p-1 hover:bg-purple-700 rounded-md text-purple-200 hover:text-white"
                        title="Rename this team"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      {participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTeam(team)}
                          className="p-1 hover:bg-rose-700 rounded-md text-purple-200 hover:text-rose-100"
                          title="Delete team"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Inline Rename Form */}
          {isEditingTeam && (
            <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-xl border border-amber-300">
              <span className="text-xs font-nunito font-black text-amber-900">Rename Team:</span>
              <input
                type="text"
                value={editTeamInput}
                onChange={e => setEditTeamInput(e.target.value)}
                className="p-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-800 flex-1"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveRename}
                className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTeam(false)}
                className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
         🎖️ OFFICIAL STORY SPRINT PASSPORT CREDENTIAL CARD (ISOLATED ELEMENT)
         (This exact card is captured cleanly with high DPI for PNG & PDF)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full flex justify-center">
        <motion.div
          id="passport-credential-card"
          ref={passportCardRef}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-br from-amber-50 via-[#faf6ed] to-amber-100/90 rounded-[32px] p-6 sm:p-10 border-[6px] border-amber-400 shadow-2xl flex flex-col gap-6 text-slate-900 relative overflow-hidden"
          style={{ boxSizing: 'border-box' }}
        >
          {/* Subtle Guilloche/Parchment watermark texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Corner Gilded Brackets */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-500 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-amber-500 rounded-bl-2xl pointer-events-none" />

          {/* Header Ribbon */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-amber-300 pb-5 gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl text-white shadow-md border-2 border-white shrink-0">
                🎖️
              </div>
              <div>
                <span className="text-[11px] font-nunito font-black text-amber-800 uppercase tracking-widest block">
                  SkilliZee Official Certified Creator Credential
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
                  Official Story Sprint Passport
                </h2>
                <p className="font-nunito font-semibold text-xs text-slate-600">
                  Issued for outstanding creative authorship of "{storyTitle}"
                </p>
              </div>
            </div>

            {/* Golden Stamp Seal */}
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-amber-600 bg-amber-200/80 flex flex-col items-center justify-center text-center rotate-6 shadow-sm shrink-0 border-double">
              <span className="text-xl">⭐</span>
              <span className="text-[9px] font-display font-black text-amber-950 leading-tight">
                VERIFIED AUTHOR
              </span>
            </div>
          </div>

          {/* Identity Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/80 p-4 rounded-2xl border-2 border-amber-200 text-xs font-nunito shadow-xs relative z-10">
            <div>
              <span className="text-slate-400 font-bold block">Storyteller Team:</span>
              <span className="font-display font-black text-base text-purple-900">{selectedStudent}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block">Classroom:</span>
              <span className="font-bold text-slate-800">{className}</span>
            </div>
            <div className="flex items-center gap-2">
              {hero?.image ? (
                <img src={hero.image} alt={hero.name} className="w-8 h-8 rounded-lg object-cover border border-purple-300 shrink-0" />
              ) : null}
              <div>
                <span className="text-slate-400 font-bold block">Hero Explored:</span>
                <span className="font-bold text-slate-800">{hero?.name || 'Naruto Uzumaki'}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-bold block">World Setting:</span>
              <span className="font-bold text-slate-800">{world?.name || 'Hidden Island'}</span>
            </div>
          </div>

          {/* Sprint Contributions Log */}
          <div className="space-y-2 relative z-10">
            <h4 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Recorded Chapter Contributions</span>
            </h4>

            {studentPasses.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {studentPasses.map((pass, idx) => (
                  <div key={idx} className="bg-white/95 p-3 rounded-xl border border-amber-200 text-xs font-nunito flex items-start justify-between gap-3 shadow-xs">
                    <div>
                      <span className="font-black text-purple-700 block">{pass.chapterTitle}</span>
                      <p className="text-slate-700 mt-0.5 italic font-medium">"{pass.contribution}"</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold shrink-0">{pass.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200 text-xs font-nunito text-slate-600 font-semibold shadow-xs">
                Active certified co-creator in classroom voting, story sequencing, plot twists, and climax solution!
              </div>
            )}
          </div>

          {/* Unlocked Badges Showcase */}
          <div className="space-y-2 border-t-2 border-amber-200 pt-4 relative z-10">
            <h4 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Honors & Badges Earned</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {achievements.slice(0, 4).map((ach) => (
                <div
                  key={ach.id}
                  className="bg-white/95 p-2.5 rounded-2xl border border-amber-300 flex items-center gap-2 shadow-xs"
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <div className="truncate">
                    <span className="font-display font-black text-xs text-slate-900 block truncate">
                      {ach.title}
                    </span>
                    <span className="text-[10px] font-nunito text-emerald-600 font-black">
                      ✓ Awarded
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures & Authentication */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t-2 border-dashed border-amber-300 pt-4 text-xs font-nunito text-slate-600 gap-3 relative z-10">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Teacher Verification Stamp: Approved for Creative Excellence</span>
            </div>
            <div className="text-right italic font-display font-black text-purple-900 text-sm">
              Pass the Baton. Build the Story.
            </div>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

