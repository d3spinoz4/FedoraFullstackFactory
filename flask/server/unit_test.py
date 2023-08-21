from __init__ import benfordslaw
import pandas as pd
import unittest
import os

dir_path = os.path.dirname(os.path.realpath(__file__))

class Solution:

    def befords_case(self, test_file):
        immi = pd.read_csv(os.path.join(dir_path, test_file),sep='\t')

        immi.rename(columns={'7_2009': 'Population'}, inplace=True)

        bl = benfordslaw(alpha=0.05, method=None)

        results = bl.fit(immi.Population.values)

        return results


class TestSolution(unittest.TestCase):

    def test_runDF(self):
        test_case = Solution()  
        full_path = os.path.join(dir_path, 'unittest_file.txt')
        test_results = test_case.befords_case(full_path)
        self.assertTrue(type(test_results) == dict, msg="Test did not pass!")


if __name__ == '__main__':
    unittest.main()
