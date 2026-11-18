import { useLayoutEffect, useRef, useState } from "react";

const STARTING_BALANCE = 100;
const STARTING_BET = 10;
const SUITS = ["CLUB", "DIAMOND", "HEART", "SPADE"];
const RANK_NAMES = { 11: "JACK", 12: "QUEEN", 13: "KING" };
const PHASE = {
    IDLE: "idle",
    PLAYER_TURN: "player",
    DEALER_REVEAL: "reveal",
    DEALER_TURN: "dealer",
    RESULT: "result",
};

function createDeck() {
    return SUITS.flatMap((suit) =>
        Array.from({ length: 13 }, (_, index) => ({
            suit,
            rank: index + 2,
        }))
    );
}

function shuffleDeck(deck) {
    for (let index = deck.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
    }
    return deck;
}

function getCardImage(card) {
    const assetRank = card.rank === 14 ? 1 : card.rank;
    const suffix = RANK_NAMES[card.rank] ? `-${RANK_NAMES[card.rank]}` : "";
    return `/cards/faces/${card.suit}-${assetRank}${suffix}.svg`;
}

function getHandValue(hand) {
    let total = 0;
    let aces = 0;

    hand.forEach(({ rank }) => {
        if (rank === 14) {
            total += 11;
            aces += 1;
        } else {
            total += Math.min(rank, 10);
        }
    });

    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }

    return { total, soft: aces > 0 };
}

function isNaturalBlackjack(hand) {
    return hand.length === 2 && getHandValue(hand).total === 21;
}

function getRoundOutcome(playerHand, dealerHand) {
    const player = getHandValue(playerHand).total;
    const dealer = getHandValue(dealerHand).total;
    const playerBlackjack = isNaturalBlackjack(playerHand);
    const dealerBlackjack = isNaturalBlackjack(dealerHand);

    if (player > 21) return "loss";
    if (playerBlackjack && dealerBlackjack) return "tie";
    if (playerBlackjack) return "blackjack";
    if (dealerBlackjack) return "loss";
    if (dealer > 21) return "win";
    if (player > dealer) return "win";
    if (player < dealer) return "loss";
    return "tie";
}

function PlayingCard({
    card,
    faceDown = false,
    dealOrder = 0,
    revealed = false,
    dealOriginRef,
    layoutSnapshotRef,
    layoutVersion,
    cardIndex,
    onDealStart,
    onDealEnd,
    onRevealEnd,
}) {
    const cardRef = useRef(null);
    const previousPositionRef = useRef(null);
    const [dealReady, setDealReady] = useState(false);
    const label = card
        ? `${card.rank === 14 ? "Ace" : card.rank} of ${card.suit.toLowerCase()}s`
        : "Card back";

    useLayoutEffect(() => {
        if (!cardRef.current) return;
        if (dealOriginRef?.current) {
            const cardBounds = cardRef.current.getBoundingClientRect();
            const originBounds = dealOriginRef.current.getBoundingClientRect();
            cardRef.current.style.setProperty("--deal-x", `${originBounds.left + originBounds.width / 2 - cardBounds.left - cardBounds.width / 2}px`);
            cardRef.current.style.setProperty("--deal-y", `${originBounds.top + originBounds.height / 2 - cardBounds.top - cardBounds.height / 2}px`);
        }
        setDealReady(true);
    }, [dealOriginRef]);

    useLayoutEffect(() => {
        if (!cardRef.current) return;

        const bounds = cardRef.current.getBoundingClientRect();
        const position = { left: bounds.left, top: bounds.top };
        const snapshot = layoutSnapshotRef.current.get(cardIndex);
        const previousPosition = snapshot ?? previousPositionRef.current;
        layoutSnapshotRef.current.delete(cardIndex);
        previousPositionRef.current = position;

        if (!previousPosition) return;
        const offsetX = previousPosition.left - position.left;
        const offsetY = previousPosition.top - position.top;
        if (!offsetX && !offsetY) return;

        cardRef.current.style.transition = "none";
        cardRef.current.style.translate = `${offsetX}px ${offsetY}px`;
        cardRef.current.getBoundingClientRect();
        cardRef.current.style.removeProperty("transition");
        const frame = requestAnimationFrame(() => {
            cardRef.current?.style.removeProperty("translate");
        });

        return () => cancelAnimationFrame(frame);
    }, [cardIndex, layoutSnapshotRef, layoutVersion]);

    return (
        <div
            className={`blackjack-card-frame${revealed ? " revealed" : ""}${dealReady ? " deal-ready" : ""}`}
            style={{ "--deal-order": dealOrder }}
            ref={cardRef}
            onAnimationStart={() => onDealStart?.()}
            onAnimationEnd={(event) => {
                if (event.target !== event.currentTarget) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                previousPositionRef.current = { left: bounds.left, top: bounds.top };
                onDealEnd?.();
            }}
        >
            {revealed ? (
                <div
                    className="blackjack-card-flipper"
                    onAnimationEnd={(event) => {
                        if (event.target === event.currentTarget) onRevealEnd?.();
                    }}
                >
                    <img
                        className="blackjack-card blackjack-card-front"
                        src={getCardImage(card)}
                        alt={label}
                    />
                    <img
                        className="blackjack-card blackjack-card-back"
                        src="/cards/pattern-blue.png"
                        alt=""
                        aria-hidden="true"
                    />
                </div>
            ) : (
                <img
                    className="blackjack-card"
                    src={faceDown ? "/cards/pattern-blue.png" : getCardImage(card)}
                    alt={faceDown ? "Face-down card" : label}
                />
            )}
        </div>
    );
}

function handDescription(hand) {
    const { total, soft } = getHandValue(hand);
    return `${soft ? "Soft " : ""}${total}`;
}

export default function Blackjack() {
    const [phase, setPhase] = useState(PHASE.IDLE);
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [outcome, setOutcome] = useState(null);
    const [balance, setBalance] = useState(STARTING_BALANCE);
    const [highScore, setHighScore] = useState(STARTING_BALANCE);
    const [handBet, setHandBet] = useState(STARTING_BET);
    const [betAmount, setBetAmount] = useState(String(STARTING_BET));
    const [roundNumber, setRoundNumber] = useState(0);
    const [visiblePlayerCards, setVisiblePlayerCards] = useState([]);
    const [visibleDealerCards, setVisibleDealerCards] = useState(0);
    const [dealerCardsInPlay, setDealerCardsInPlay] = useState(0);
    const [settledPlayerCards, setSettledPlayerCards] = useState([]);
    const [settledDealerCards, setSettledDealerCards] = useState([]);
    const [dealerRevealComplete, setDealerRevealComplete] = useState(false);
    const [pendingRound, setPendingRound] = useState(null);
    const dealOriginRef = useRef(null);
    const playerCardsRef = useRef(null);
    const dealerCardsRef = useRef(null);
    const playerLayoutSnapshotRef = useRef(new Map());
    const dealerLayoutSnapshotRef = useRef(new Map());
    const currentBet = Number(betAmount);
    const canDeal = Number.isInteger(currentBet) && currentBet >= 1 && currentBet <= balance;
    const displayedBalance = phase === PHASE.PLAYER_TURN ? balance - handBet : balance;
    const resultReady = phase === PHASE.RESULT
        && settledPlayerCards.length === playerHand.length
        && settledDealerCards.length === dealerHand.length
        && dealerRevealComplete;

    function captureCardPositions(containerRef, snapshotRef) {
        const positions = new Map();
        containerRef.current?.querySelectorAll(".blackjack-card-frame").forEach((card, index) => {
            const bounds = card.getBoundingClientRect();
            positions.set(index, { left: bounds.left, top: bounds.top });
        });
        snapshotRef.current = positions;
    }

    function finishRound(finalPlayerHand, finalDealerHand, finalDeck, wager) {
        const result = getRoundOutcome(finalPlayerHand, finalDealerHand);
        setPendingRound(null);
        setPlayerHand(finalPlayerHand);
        setDealerHand(finalDealerHand);
        setVisibleDealerCards(finalDealerHand.length);
        setDealerCardsInPlay(finalDealerHand.length);
        setDeck(finalDeck);
        setOutcome(result);
        const payout = result === "blackjack" ? wager * 2.5
            : result === "win" ? wager * 2
                : result === "tie" ? wager
                    : 0;
        const settledBalance = balance - wager + payout;
        setBalance(settledBalance);
        setHighScore((current) => Math.max(current, settledBalance));
        setPhase(PHASE.RESULT);
    }

    function dealHand() {
        if (!canDeal) return;
        playerLayoutSnapshotRef.current.clear();
        dealerLayoutSnapshotRef.current.clear();
        const wager = currentBet;
        setRoundNumber((current) => current + 1);
        setVisiblePlayerCards([]);
        setSettledPlayerCards([]);
        setSettledDealerCards([]);
        setVisibleDealerCards(1);
        setDealerCardsInPlay(2);
        setDealerRevealComplete(false);
        const cards = shuffleDeck(createDeck());
        const nextPlayer = [cards[0], cards[2]];
        const nextDealer = [cards[1], cards[3]];
        const remaining = cards.slice(4);
        setHandBet(wager);
        setPlayerHand(nextPlayer);
        setDealerHand(nextDealer);
        setDeck(remaining);
        setOutcome(null);

        if (isNaturalBlackjack(nextPlayer) || isNaturalBlackjack(nextDealer)) {
            finishRound(nextPlayer, nextDealer, remaining, wager);
        } else {
            setPhase(PHASE.PLAYER_TURN);
        }
    }

    function hit() {
        captureCardPositions(playerCardsRef, playerLayoutSnapshotRef);
        const remaining = [...deck];
        const nextPlayer = [...playerHand, remaining.shift()];
        setPlayerHand(nextPlayer);
        setDeck(remaining);
        const total = getHandValue(nextPlayer).total;
        if (total > 21) {
            finishRound(nextPlayer, dealerHand, remaining, handBet);
        } else if (total === 21) {
            finishDealerTurn(nextPlayer, remaining, handBet);
        }
    }

    function finishDealerTurn(finalPlayerHand, finalDeck, wager) {
        const remaining = [...finalDeck];
        const nextDealer = [...dealerHand];

        while (getHandValue(nextDealer).total < 17) {
            nextDealer.push(remaining.shift());
        }

        const round = {
            playerHand: finalPlayerHand,
            dealerHand: nextDealer,
            deck: remaining,
            wager,
        };
        setPlayerHand(finalPlayerHand);
        setPendingRound(round);
        setPhase(PHASE.DEALER_REVEAL);
    }

    function finishDealerCardDeal(index) {
        if (phase !== PHASE.DEALER_TURN || !pendingRound) return;
        captureCardPositions(dealerCardsRef, dealerLayoutSnapshotRef);
        setVisibleDealerCards(index + 1);
        if (index !== pendingRound.dealerHand.length - 1) {
            setDealerCardsInPlay(index + 2);
            return;
        }
        finishRound(
            pendingRound.playerHand,
            pendingRound.dealerHand,
            pendingRound.deck,
            pendingRound.wager
        );
    }

    function finishDealerReveal() {
        if (phase !== PHASE.DEALER_REVEAL || !pendingRound) return;
        captureCardPositions(dealerCardsRef, dealerLayoutSnapshotRef);
        setDealerHand(pendingRound.dealerHand);
        setDeck(pendingRound.deck);
        if (pendingRound.dealerHand.length === dealerHand.length) {
            finishRound(
                pendingRound.playerHand,
                pendingRound.dealerHand,
                pendingRound.deck,
                pendingRound.wager
            );
            return;
        }
        setVisibleDealerCards(dealerHand.length);
        setDealerCardsInPlay(Math.min(3, pendingRound.dealerHand.length));
        setPhase(PHASE.DEALER_TURN);
    }

    function stand() {
        finishDealerTurn(playerHand, deck, handBet);
    }

    function doubleDown() {
        if (playerHand.length !== 2 || balance < handBet * 2) return;

        captureCardPositions(playerCardsRef, playerLayoutSnapshotRef);
        const wager = handBet * 2;
        const remaining = [...deck];
        const nextPlayer = [...playerHand, remaining.shift()];
        setHandBet(wager);
        setPlayerHand(nextPlayer);
        setDeck(remaining);

        if (getHandValue(nextPlayer).total > 21) {
            finishRound(nextPlayer, dealerHand, remaining, wager);
        } else {
            finishDealerTurn(nextPlayer, remaining, wager);
        }
    }

    function startNewGame() {
        playerLayoutSnapshotRef.current.clear();
        dealerLayoutSnapshotRef.current.clear();
        setBalance(STARTING_BALANCE);
        setHandBet(STARTING_BET);
        setPlayerHand([]);
        setDealerHand([]);
        setVisibleDealerCards(0);
        setDealerCardsInPlay(0);
        setSettledPlayerCards([]);
        setSettledDealerCards([]);
        setDealerRevealComplete(false);
        setDeck([]);
        setOutcome(null);
        setPendingRound(null);
        setPhase(PHASE.IDLE);
    }

    const resultText = {
        blackjack: "Blackjack!",
        win: getHandValue(playerHand).total === 21 ? "Blackjack!" : "You win!",
        loss: getHandValue(playerHand).total > 21 ? "Bust, dealer wins" : "Dealer wins",
        tie: "Push, it's a tie",
    };
    const displayedDealerCards = phase === PHASE.DEALER_TURN
        ? dealerHand.slice(0, dealerCardsInPlay)
        : dealerHand;

    return (
        <main className="blackjack-page">
            <section className="blackjack-shell" aria-label="Blackjack game">
                <div className="blackjack-table">
                    <header className="blackjack-heading">
                        <div className="blackjack-bankroll" aria-label={`High score: $${highScore}; current balance: $${displayedBalance}`}>
                            <div className="blackjack-score-line">
                                <strong>High score</strong>
                                <span className="blackjack-score-value">${highScore}</span>
                            </div>
                            <span className="blackjack-current-balance">Balance: ${displayedBalance}</span>
                        </div>
                    </header>

                    <div className="blackjack-shoe" ref={dealOriginRef} aria-hidden="true">
                        <img src="/cards/pattern-blue.png" alt="" />
                        <img src="/cards/pattern-blue.png" alt="" />
                        <img src="/cards/pattern-blue.png" alt="" />
                    </div>
                    <section className="blackjack-hand dealer-hand" aria-label="Dealer's hand">
                        <div className="blackjack-hand-heading">
                            <h2>Dealer</h2>
                            <span>{phase === PHASE.DEALER_REVEAL || phase === PHASE.DEALER_TURN || phase === PHASE.RESULT
                                ? handDescription(dealerHand.slice(0, visibleDealerCards))
                                : dealerHand.length ? `${handDescription([dealerHand[0]])} showing` : ""}</span>
                        </div>
                        <div
                            className={`blackjack-cards${displayedDealerCards.length > 3 ? " has-many" : ""}`}
                            ref={dealerCardsRef}
                        >
                            {displayedDealerCards.length
                                ? displayedDealerCards.map((card, index) => (
                                    <PlayingCard
                                        key={`${roundNumber}-dealer-${index}`}
                                        card={card}
                                        dealOriginRef={dealOriginRef}
                                        layoutSnapshotRef={dealerLayoutSnapshotRef}
                                        layoutVersion={displayedDealerCards.length}
                                        cardIndex={index}
                                        faceDown={index === 1
                                            && (phase !== PHASE.RESULT || !settledDealerCards.includes(index))}
                                        dealOrder={index < 2 ? index * 2 + 1 : 0}
                                        revealed={(phase === PHASE.DEALER_REVEAL || phase === PHASE.DEALER_TURN || phase === PHASE.RESULT)
                                            && index === 1
                                            && settledDealerCards.includes(index)}
                                        onDealEnd={() => {
                                            setSettledDealerCards((settled) =>
                                                settled.includes(index) ? settled : [...settled, index]
                                            );
                                            if (index >= 2) finishDealerCardDeal(index);
                                        }}
                                        onRevealEnd={() => {
                                            setDealerRevealComplete(true);
                                            if (index === 1) finishDealerReveal();
                                        }}
                                    />
                                ))
                                : Array.from({ length: 2 }, (_, index) => (
                                    <div
                                        key={`${roundNumber}-dealer-empty-${index}`}
                                        className="blackjack-card-frame placeholder"
                                        aria-hidden="true"
                                    />
                                ))}
                        </div>
                    </section>

                    <div className="blackjack-round-message" aria-live="polite">
                        {phase === PHASE.IDLE && <strong>Place your bet</strong>}
                        {phase === PHASE.PLAYER_TURN && <strong>Your turn</strong>}
                        {resultReady && <div className="blackjack-result"><strong>{resultText[outcome]}</strong></div>}
                    </div>

                    <section className="blackjack-hand player-hand" aria-label="Your hand">
                        <div
                            className={`blackjack-cards${playerHand.length > 3 ? " has-many" : ""}`}
                            ref={playerCardsRef}
                        >
                            {playerHand.length
                                ? playerHand.map((card, index) => (
                                    <PlayingCard
                                        key={`${roundNumber}-player-${index}`}
                                        card={card}
                                        dealOriginRef={dealOriginRef}
                                        layoutSnapshotRef={playerLayoutSnapshotRef}
                                        layoutVersion={playerHand.length}
                                        cardIndex={index}
                                        dealOrder={index === 0 ? 0 : index === 1 ? 2 : 0}
                                        onDealStart={() => setVisiblePlayerCards((visible) =>
                                            visible.includes(index) ? visible : [...visible, index]
                                        )}
                                        onDealEnd={() => setSettledPlayerCards((settled) =>
                                            settled.includes(index) ? settled : [...settled, index]
                                        )}
                                    />
                                ))
                                : Array.from({ length: 2 }, (_, index) => (
                                    <div
                                        key={`${roundNumber}-player-empty-${index}`}
                                        className="blackjack-card-frame placeholder"
                                        aria-hidden="true"
                                    />
                                ))}
                        </div>
                        <div className="blackjack-hand-heading">
                            <h2>Your hand</h2>
                            <span>
                                {visiblePlayerCards.length
                                    ? handDescription(playerHand.filter((_, index) => visiblePlayerCards.includes(index)))
                                    : ""}
                            </span>
                        </div>
                    </section>

                    <div className="blackjack-actions">
                        {(phase === PHASE.IDLE || phase === PHASE.RESULT) && balance > 0 && (
                            <label className="blackjack-bet">
                                Bet
                                <span className="blackjack-bet-input">
                                    <span aria-hidden="true">$</span>
                                    <input
                                        aria-label="Bet amount"
                                        type="number"
                                        min="1"
                                        max={balance}
                                        step="1"
                                        value={betAmount}
                                        onChange={(event) => setBetAmount(event.target.value)}
                                        onBlur={() => {
                                            const amount = Number(betAmount);
                                            const validAmount = Number.isInteger(amount) && amount > 0
                                                ? amount
                                                : Math.min(STARTING_BET, balance);
                                            setBetAmount(String(Math.min(validAmount, balance)));
                                        }}
                                    />
                                </span>
                            </label>
                        )}
                        {(phase === PHASE.IDLE || phase === PHASE.RESULT) && (
                            balance > 0
                                ? <button type="button" className="blackjack-action primary deal" onClick={dealHand} disabled={!canDeal}>{phase === PHASE.IDLE ? "Deal" : "Play again"} - ${canDeal ? currentBet : "-"}</button>
                                : <button type="button" className="blackjack-action primary" onClick={startNewGame}>Restart</button>
                        )}
                        {phase === PHASE.PLAYER_TURN && (
                            <>
                                <button type="button" className="blackjack-action primary" onClick={hit}>Hit</button>
                                <button type="button" className="blackjack-action secondary" onClick={stand}>Stand</button>
                                {playerHand.length === 2 && (
                                    <button
                                        type="button"
                                        className="blackjack-action secondary"
                                        onClick={doubleDown}
                                        disabled={balance < handBet * 2}
                                        title={balance < handBet * 2 ? "Not enough money to double down" : `Double your bet to $${handBet * 2} and draw one card`}
                                    >
                                        Double - ${handBet * 2}
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                </div>
            </section>
        </main>
    );
}
