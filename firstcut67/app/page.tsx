"use client";

import { useMemo, useState } from "react";

type PickOption = {
  label: string;
  odds: string;
};

type Game = {
  sport: string;
  matchup: string;
  time: string;
  picks: PickOption[];
};

type SlipPick = PickOption & {
  matchup: string;
  sport: string;
};

const featuredGames: Game[] = [
  {
    sport: "NFL",
    matchup: "Chiefs vs Bills",
    time: "Sun · 1:00 PM",
    picks: [
      { label: "Chiefs -3.5", odds: "+110" },
      { label: "Bills +3.5", odds: "-105" },
      { label: "Over 49.5", odds: "+100" },
    ],
  },
  {
    sport: "NBA",
    matchup: "Lakers vs Celtics",
    time: "Tonight · 8:30 PM",
    picks: [
      { label: "Lakers +4", odds: "-110" },
      { label: "Celtics -4", odds: "-108" },
      { label: "Over 228.5", odds: "+102" },
    ],
  },
  {
    sport: "MLB",
    matchup: "Yankees vs Dodgers",
    time: "Tonight · 7:10 PM",
    picks: [
      { label: "Yankees ML", odds: "+140" },
      { label: "Dodgers ML", odds: "-160" },
      { label: "Run Line +1.5", odds: "+125" },
    ],
  },
  {
    sport: "NHL",
    matchup: "Panthers vs Rangers",
    time: "Fri · 7:00 PM",
    picks: [
      { label: "Panthers -125", odds: "-125" },
      { label: "Rangers +105", odds: "+105" },
      { label: "Draw +330", odds: "+330" },
    ],
  },
];

const navItems = ["Sportsbook", "My Bets", "Leaderboard", "Profile"];

const getAmericanOddsBreakdown = (odds: string, stake: number) => {
  const numericOdds = Number(odds.replace(/[+\-]/g, ""));
  let profit = 0;

  if (odds.startsWith("+")) {
    profit = stake * (numericOdds / 100);
  } else if (odds.startsWith("-")) {
    profit = stake / (numericOdds / 100);
  } else {
    profit = stake;
  }

  const totalPayout = stake + profit;

  return { profit, totalPayout };
};

export default function Home() {
  const [selectedPicks, setSelectedPicks] = useState<SlipPick[]>([]);
  const [stake, setStake] = useState(15);
  const [balance, setBalance] = useState(250);
  const [activeTab, setActiveTab] = useState("Sportsbook");
  const [message, setMessage] = useState("Select a line to add it to your bet slip.");

  const { profit, totalPayout } = useMemo(() => {
    if (!selectedPicks.length) {
      return { profit: stake, totalPayout: stake };
    }

    return getAmericanOddsBreakdown(selectedPicks[0].odds, stake);
  }, [selectedPicks, stake]);

  const selectPick = (game: Game, pick: PickOption) => {
    const nextPick = { ...pick, matchup: game.matchup, sport: game.sport };
    setSelectedPicks([nextPick]);
    setMessage("Selection added to your slip.");
  };

  const clearSelections = () => {
    setSelectedPicks([]);
    setMessage("Selection removed.");
  };

  const placeBet = () => {
    if (!selectedPicks.length) {
      setMessage("Choose one pick before placing a bet.");
      return;
    }

    if (balance < stake) {
      setMessage("Demo balance is too low for this stake.");
      return;
    }

    setBalance((currentBalance) => currentBalance - stake);
    setSelectedPicks([]);
    setMessage("Bet placed successfully.");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#123b26_0%,_#07140d_45%,_#030806_100%)] px-4 py-4 text-emerald-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-[28px] border border-emerald-900/70 bg-black/30 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-emerald-800/70 bg-[#071a12]/90 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">Virtual sportsbook</p>
            <h1 className="text-2xl font-semibold text-emerald-50">FirstCut67</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-700/80 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Balance ${balance}
          </div>
        </header>

        <main className="grid gap-4 lg:grid-cols-[1.6fr_0.8fr]">
          <section className="space-y-4">
            <div className="rounded-[22px] border border-emerald-800/70 bg-[#071a12]/90 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-emerald-400">Today’s action</p>
                  <h2 className="text-xl font-semibold text-white">Hot picks across the board</h2>
                </div>
                <div className="rounded-full border border-emerald-700/70 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                  Live odds
                </div>
              </div>

              <div className="grid gap-3">
                {featuredGames.map((game) => (
                  <article
                    key={game.matchup}
                    className="rounded-[18px] border border-emerald-900/70 bg-[#0b2318] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">{game.sport}</p>
                        <h3 className="text-lg font-semibold text-white">{game.matchup}</h3>
                      </div>
                      <p className="text-sm text-emerald-300">{game.time}</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {game.picks.map((pick) => {
                        const isSelected = selectedPicks.some(
                          (entry) => entry.label === pick.label && entry.matchup === game.matchup,
                        );

                        return (
                          <button
                            key={pick.label}
                            type="button"
                            onClick={() => selectPick(game, pick)}
                            className={`rounded-xl border px-3 py-2 text-left transition ${
                              isSelected
                                ? "border-emerald-400 bg-emerald-500/20"
                                : "border-emerald-800/80 bg-[#082018] hover:border-emerald-500 hover:bg-[#0d2d20]"
                            }`}
                          >
                            <p className="text-sm font-medium text-white">{pick.label}</p>
                            <p className="mt-1 text-sm font-semibold text-emerald-400">{pick.odds}</p>
                          </button>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[22px] border border-emerald-800/70 bg-[#071a12]/90 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-emerald-400">Bet slip</p>
                  <h2 className="text-lg font-semibold text-white">Your picks</h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                  {selectedPicks.length} selection{selectedPicks.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="rounded-[16px] border border-dashed border-emerald-700/70 bg-[#081910] p-4 text-sm text-emerald-200/80">
                {selectedPicks.length ? (
                  <ul className="space-y-2">
                    {selectedPicks.map((entry) => (
                      <li key={`${entry.matchup}-${entry.label}`} className="rounded-lg bg-[#0e2a1d] p-2">
                        <p className="font-medium text-emerald-100">{entry.matchup}</p>
                        <p className="text-sm text-emerald-300">{entry.label} · {entry.odds}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    <p className="mb-2 font-medium text-emerald-100">No picks added yet</p>
                    <p>Select any American odds button to build your slip.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-[16px] border border-emerald-800/70 bg-[#081910] p-3">
                <label className="mb-2 block text-sm text-emerald-200" htmlFor="stake">
                  Stake
                </label>
                <input
                  id="stake"
                  type="number"
                  min="5"
                  max="1000"
                  value={stake}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    if (Number.isNaN(nextValue) || nextValue <= 0) {
                      setStake(5);
                      return;
                    }
                    setStake(Math.min(1000, Math.max(5, Math.floor(nextValue))));
                  }}
                  className="w-full rounded-lg border border-emerald-800 bg-[#0d2418] px-3 py-2 text-emerald-50 outline-none"
                />
                <div className="mt-3 flex items-center justify-between text-sm text-emerald-200">
                  <span>Potential profit</span>
                  <span>${profit.toFixed(0)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-emerald-200">
                  <span>Total payout</span>
                  <span>${totalPayout.toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-3 rounded-[14px] bg-[#0a1d14] px-3 py-2 text-sm text-emerald-200">
                {message}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={clearSelections}
                  className="flex-1 rounded-full border border-emerald-700 px-4 py-3 font-semibold text-emerald-200 transition hover:bg-[#11261b]"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={placeBet}
                  className="flex-1 rounded-full bg-emerald-500 px-4 py-3 font-semibold text-[#03110a] transition hover:bg-emerald-400"
                >
                  Place Bet
                </button>
              </div>
            </div>

            <div className="rounded-[22px] border border-emerald-800/70 bg-[#071a12]/90 p-4">
              <p className="text-sm font-medium text-emerald-400">Quick insight</p>
              <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                Balanced lines, sharp pricing, and fast cash-out options keep your live ticket flow smooth.
              </p>
            </div>
          </aside>
        </main>

        <nav className="flex flex-wrap items-center justify-between gap-2 rounded-[20px] border border-emerald-800/70 bg-[#071a12]/90 px-3 py-3 sm:px-4">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveTab(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === item
                  ? "bg-emerald-500 text-[#03110a]"
                  : "bg-[#0d2418] text-emerald-200 hover:bg-[#123623]"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
