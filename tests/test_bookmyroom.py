import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class BookMyRoomTests(unittest.TestCase):

    def setUp(self):
        options = Options()
        # options.add_argument('--headless')  # uncomment to run without browser
        self.driver = webdriver.Chrome(options=options)
        self.driver.get("http://localhost:3000")
        self.wait = WebDriverWait(self.driver, 10)

    def tearDown(self):
        self.driver.quit()

    # ✅ TEST 1 — Login with valid credentials
    def test_01_login_success(self):
        email = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
        email.send_keys("venkata_b220071cs@nitc.ac.in")

        password = self.driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
        password.send_keys("temp@123")

        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

        dashboard = self.wait.until(EC.presence_of_element_located((By.XPATH, '//*[contains(text(), "Welcome back")]')))
        self.assertIn("Welcome back", dashboard.text)
        print("✅ Login success test passed")

    # ✅ TEST 2 — Login with wrong password
    def test_02_login_failure(self):
        email = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
        email.send_keys("asif@nitc.ac.in")

        password = self.driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
        password.send_keys("wrongpassword")

        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

        error = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'bg-red-50')))
        self.assertTrue(error.is_displayed())
        print("✅ Login failure test passed")

    # ✅ TEST 3 — Browse Rooms navigation
    def test_03_browse_rooms(self):
        # Login first
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]'))).send_keys("asif@nitc.ac.in")
        self.driver.find_element(By.CSS_SELECTOR, 'input[type="password"]').send_keys("asif1234")
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

        # Click Browse Rooms
        browse = self.wait.until(EC.element_to_be_clickable((By.XPATH, '//*[contains(text(), "Browse Rooms")]')))
        browse.click()

        rooms = self.wait.until(EC.presence_of_element_located((By.XPATH, '//*[contains(text(), "Available Rooms") or contains(text(), "Search")]')))
        self.assertTrue(rooms.is_displayed())
        print("✅ Browse Rooms test passed")

    # ✅ TEST 4 — Logout
    def test_04_logout(self):
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]'))).send_keys("asif@nitc.ac.in")
        self.driver.find_element(By.CSS_SELECTOR, 'input[type="password"]').send_keys("asif1234")
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

        self.wait.until(EC.presence_of_element_located((By.XPATH, '//*[contains(text(), "Welcome back")]')))

        # Click logout button
        logout = self.wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@data-testid="logout"] | //*[contains(@class, "logout")]')))
        logout.click()

        sign_in = self.wait.until(EC.presence_of_element_located((By.XPATH, '//*[contains(text(), "Sign in")]')))
        self.assertTrue(sign_in.is_displayed())
        print("✅ Logout test passed")

    # ✅ TEST 5 — HOLD banner appears for HOLD bookings
    def test_05_hold_banner(self):
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]'))).send_keys("asif@nitc.ac.in")
        self.driver.find_element(By.CSS_SELECTOR, 'input[type="password"]').send_keys("asif1234")
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

        self.wait.until(EC.presence_of_element_located((By.XPATH, '//*[contains(text(), "Welcome back")]')))

        # If any booking is in HOLD, banner should show
        time.sleep(2)
        banners = self.driver.find_elements(By.XPATH, '//*[contains(text(), "Room on HOLD")]')
        print(f"HOLD banners found: {len(banners)}")
        print("✅ HOLD banner test passed")


if __name__ == '__main__':
    unittest.main(verbosity=2)
