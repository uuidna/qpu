package qpu

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// Client represents a QPU client
type Client struct {
	BaseURL string
	Timeout time.Duration
	client  *http.Client
}

// NewClient creates a new QPU client
func NewClient(baseURL string) *Client {
	return &Client{
		BaseURL: baseURL,
		Timeout: 30 * time.Second,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// ShorFactor factors a number using Shor's algorithm
func (c *Client) ShorFactor(n int64) ([]int64, error) {
	result := struct {
		Factors []int64 `json:"factors"`
	}{}

	err := c.call("cryptography/shor", map[string]int64{"N": n}, &result)
	if err != nil {
		return nil, err
	}

	return result.Factors, nil
}

// GroverSearch searches for a target in a search space
func (c *Client) GroverSearch(target, searchSpace int64) (map[string]interface{}, error) {
	result := make(map[string]interface{})

	err := c.call("search/grover", map[string]int64{
		"target":       target,
		"search_space": searchSpace,
	}, &result)

	return result, err
}

// DiscreteLog solves the discrete logarithm problem
func (c *Client) DiscreteLog(base, target, prime int64) (int64, error) {
	result := struct {
		Solution int64 `json:"solution"`
	}{}

	err := c.call("cryptography/discrete-log", map[string]int64{
		"base":   base,
		"target": target,
		"prime":  prime,
	}, &result)

	return result.Solution, err
}

// Knapsack solves the knapsack optimization problem
func (c *Client) Knapsack(items []int, capacity int) (map[string]interface{}, error) {
	result := make(map[string]interface{})

	err := c.call("optimization/knapsack", map[string]interface{}{
		"items":    items,
		"capacity": capacity,
	}, &result)

	return result, err
}

// HamiltonianSimulation simulates Hamiltonian evolution
func (c *Client) HamiltonianSimulation(coupling, time float64) (map[string]interface{}, error) {
	result := make(map[string]interface{})

	err := c.call("simulation/hamiltonian", map[string]float64{
		"coupling": coupling,
		"time":     time,
	}, &result)

	return result, err
}

// RunPhase runs a specific phase
func (c *Client) RunPhase(phase string) (map[string]interface{}, error) {
	result := make(map[string]interface{})

	paths := map[string]string{
		"phase1":   "testing/phase1",
		"phase2":   "testing/phase2",
		"phase3":   "testing/phase3",
		"unified":  "testing/unified",
	}

	path, ok := paths[phase]
	if !ok {
		return nil, fmt.Errorf("unknown phase: %s", phase)
	}

	err := c.call(path, map[string]interface{}{}, &result)
	return result, err
}

// Benchmark runs a performance benchmark
func (c *Client) Benchmark() (map[string]interface{}, error) {
	result := make(map[string]interface{})
	err := c.call("testing/benchmark", map[string]interface{}{}, &result)
	return result, err
}

// call makes an API call to the QPU
func (c *Client) call(path string, params interface{}, result interface{}) error {
	url := fmt.Sprintf("%s/api/execute/%s", c.BaseURL, path)

	body, err := json.Marshal(params)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("API error: %d - %s", resp.StatusCode, string(body))
	}

	return json.NewDecoder(resp.Body).Decode(result)
}
