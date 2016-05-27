(ns mmh.parse
  (:require-macros [mmh.macros :refer [spy]]))

(defn tokens [s]
  (->> s
    (re-seq #"\[|\]|[0-9]+|[^ \[\]]+")
    (map (fn [t]
           {:value t
            :type
            (condp re-matches t
              #"\[" :lacket
              #"\]" :racket
              #"[0-9]+" :number
              :word)}))))

(defn realize [t]
  (cond
    (= :number (t :type)) (js/parseFloat (t :value))
    (= :word (t :type)) (symbol (t :value))))

(defn until [tokens stop]
  (loop [tokens tokens
         acc []]
    (if (seq tokens)
      (let [[t & ts] tokens]
        (if (= stop (t :type))
          [ts acc]
          (recur ts (conj acc (realize t)))))
      (throw (js/Error. "Unexpected end of input, expected " stop)))))

(defn ast [tokens]
  (loop [tokens tokens
         acc []]
    (if (seq tokens)
      (let [[t & ts] tokens]
        (condp = (t :type)
          :lacket (let [[ts l] (until ts :racket)]
                    (recur ts (conj acc l)))
          (recur ts (conj acc (realize t)))))
      acc)))

(comment
  (ast (tokens "a 3 [3 a] * dip"))
  )
