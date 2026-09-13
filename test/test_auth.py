def test_home(test_client):
    response = test_client.get("/docs")

    assert response.status_code == 200