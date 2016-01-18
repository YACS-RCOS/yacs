module Models
  module MathHelpers
    def factorial(n)
      n == 0 ? 1 : n.downto(1).inject(:*)
    end
  end
end