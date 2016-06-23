(ns mmh.evaluate
  (:require-macros [mmh.macros :refer [spy]])
  (:require [mmh.parse :as parse]))

(defn top [n f]
  (fn [stack]
    [(conj (vec (drop-last n stack))
           (apply f (take-last n stack)))]))

(defn top-mult [n f]
  (fn [stack]
    [(vec (concat (drop-last n stack)
                  (apply f (take-last n stack))))]))

(def words
  {'+ (top 2 +)
   '- (top 2 -)
   '* (top 2 *)
   (symbol \/) (top 2 /)
   '% (top 2 mod)
   (symbol \^) (top 2 js/Math.pow)
   'divmod (top-mult 2 (fn [x n]
                         [(js/Math.floor (/ x n))
                          (mod x n)]))
   'sqrt (top 1 #(js/Math.sqrt %))
   (symbol "√") (top 1 #(js/Math.sqrt %))
   (symbol "√3") (top 1 #(js/Math.pow % (/ 3)))
   'closest-perfect-square (top 1 #(-> % js/Math.sqrt js/Math.round (js/Math.pow 2)))
   'closest-perfect-cube (top 1 #(-> % (js/Math.pow (/ 3)) js/Math.round (js/Math.pow 3)))
   'floor (top 1 js/Math.floor)

   'dup
   (fn [stack]
     [(conj stack (last stack))])

   'dip
   (fn [stack]
     (let [[top block] (take-last 2 stack)]
       [(vec (drop-last 2 stack))
        (vec (concat block [top]))]))

   'century-and-year
   (top-mult 2
     (fn [yr]
       (let [c (js/Math.floor (/ yr 100))]
         [c (- yr (* 100 c))])))

   'century-anchor
   (top 1 #(-> % (mod 4) (* 5) (+ 2) (mod 7)))
   })

(defn step [left value]
  (cond
    (vector? value)
    [(conj left value)]

    (number? value)
    [(conj left value)]

    (symbol? value)
    (if-let [f (words value)]
      (f left)
      (throw (js/Error. (str "Unknown word `" value "`"))))

    :else
    (throw (js/Error. (str "Unknown value `" value "`")))))

(defn steps [left right]
  (loop [left left
         right right
         acc [[left right]]]
    (if (seq right)
      (let [[token & right] right
            [left right-prefix] (step left token)
            right (vec (concat right-prefix right))]
        (recur left right (conj acc [left right])))
      acc)))

(defn js->fn [expr]
  (js/eval (str "(function(x){return " expr ";})")))

(defn stack->fn [stack]
  (fn [& args]
    (-> (steps (vec args) stack) last first last)))

(comment
  (reductions step [5]
    [{:value "dup" :type :word}])
  )
