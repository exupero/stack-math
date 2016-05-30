(ns mmh.analysis)

(defn diff [a b]
  (js/Math.abs (- a b)))

(defn error [actual estimate]
  (if (= actual estimate)
    0
    (js/Math.abs
      (/ (- actual estimate)
         actual))))

(defn errorf [actual estimate margin]
  #(- (error (actual %) (estimate %))
      margin))

(defn iterate-2 [f a b]
  (cons a (lazy-seq (iterate-2 f b (f a b)))))

(defn secant [f [x0 x1]]
  (if (= x0 x1)
    x1
    (/ (- (* x0 (f x1))
          (* x1 (f x0)))
       (- (f x1) (f x0)))))

(defn secant-method [f cutoff guess]
  (loop [[xn-2 xn-1] guess
         tries 0]
    (if (< tries 100)
      (let [xn (secant f [xn-2 xn-1])]
        (cond
          (= xn-1 xn) xn
          (and (< (f xn) cutoff)
               (< (f xn-1) cutoff)
               (< (f xn-2) cutoff)) xn
          :else (recur [xn-1 xn] (inc tries))))
      (throw (js/Error. (str "Could not find zeros of " f))))))

(deftype Approximate [threshold coll]
  ICollection
  (-conj [this x]
    (if (some #(< (diff x %) threshold) coll)
      this
      (Approximate. threshold (conj coll x))))
  ISeqable
  (-seq [this]
    (seq coll)))

(defn zeros [f method guesses]
  (loop [guesses guesses
         roots (Approximate. 1e-7 #{})]
    (if (seq guesses)
      (let [[guess & guesses] guesses
            root (method f 1e-7 guess)]
        (recur guesses (conj roots root)))
      (sort roots))))
