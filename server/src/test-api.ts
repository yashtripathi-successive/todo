import { startServer } from './app';
import http from 'http';
import { disconnectDB } from './config/db';

async function runTests() {
  process.env.PORT = '5001';
  process.env.NODE_ENV = 'test';

  console.log('--- Starting Integration Test Suite ---');
  let server: http.Server;
  try {
    server = await startServer(5001);
  } catch (err) {
    console.error('Failed to start test server:', err);
    process.exit(1);
  }

  const BASE_URL = 'http://localhost:5001/api/todos';

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch('http://localhost:5001/health');
    const health = await healthRes.json();
    assert(healthRes.status === 200 && health.status === 'ok', 'Health Check');

    // 2. Reject empty title
    const emptyTitleRes = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '   ', priority: 'Medium' }),
    });
    assert(emptyTitleRes.status === 400, 'Reject whitespace-only title (HTTP 400)');

    // 3. Reject title > 200 chars
    const longTitleRes = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'a'.repeat(201), priority: 'Low' }),
    });
    assert(longTitleRes.status === 400, 'Reject title > 200 chars (HTTP 400)');

    // 4. Reject invalid priority
    const invalidPriorityRes = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Valid Title', priority: 'Urgent' }),
    });
    assert(invalidPriorityRes.status === 400, 'Reject invalid priority (HTTP 400)');

    // 5. Create valid todos
    const todo1Res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Task 1: Urgent Security Audit',
        description: 'Audit all access keys and rotation policies.',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
      }),
    });
    const todo1 = await todo1Res.json();
    assert(todo1Res.status === 201 && todo1.priority === 'High', 'Create High Priority Todo');

    const todo2Res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Task 2: Update Documentation',
        description: 'Document the new API endpoints and authentication flows.',
        priority: 'Medium',
        dueDate: new Date(Date.now() - 86400000).toISOString(), // Overdue
      }),
    });
    const todo2 = await todo2Res.json();
    assert(todo2Res.status === 201 && todo2.priority === 'Medium', 'Create Medium Priority Todo');

    const todo3Res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Task 3: Weekly Cleanup',
        description: 'Tidy up old branches.',
        priority: 'Low',
      }),
    });
    const todo3 = await todo3Res.json();
    assert(todo3Res.status === 201 && todo3.priority === 'Low', 'Create Low Priority Todo');

    // 6. Get All Todos
    const allRes = await fetch(BASE_URL);
    const allTodos = await allRes.json();
    assert(allRes.status === 200 && allTodos.length === 3, 'Get All Todos returns 3 items');

    // 7. Get Todo by ID
    const singleRes = await fetch(`${BASE_URL}/${todo1._id}`);
    const singleTodo = await singleRes.json();
    assert(
      singleRes.status === 200 && singleTodo.title === 'Task 1: Urgent Security Audit',
      'Get Todo by ID'
    );

    // 8. Update Todo
    const updateRes = await fetch(`${BASE_URL}/${todo1._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Task 1: Urgent Security Audit (Updated)',
        description: 'Updated description',
      }),
    });
    const updatedTodo = await updateRes.json();
    assert(
      updateRes.status === 200 &&
        updatedTodo.title === 'Task 1: Urgent Security Audit (Updated)',
      'Update Todo Details'
    );

    // 9. Toggle Complete
    const toggleRes = await fetch(`${BASE_URL}/${todo1._id}/complete`, {
      method: 'PATCH',
    });
    const toggled = await toggleRes.json();
    assert(
      toggleRes.status === 200 &&
        toggled.status === 'Completed' &&
        toggled.completedAt !== null,
      'Toggle Complete: Sets status to Completed and stamps completedAt'
    );

    // Toggle Back
    const toggleBackRes = await fetch(`${BASE_URL}/${todo1._id}/complete`, {
      method: 'PATCH',
    });
    const toggledBack = await toggleBackRes.json();
    assert(
      toggleBackRes.status === 200 &&
        toggledBack.status === 'Pending' &&
        toggledBack.completedAt === null,
      'Toggle Incomplete: Resets status to Pending and clears completedAt'
    );

    // Mark complete again for filter test
    await fetch(`${BASE_URL}/${todo1._id}/complete`, { method: 'PATCH' });

    // 10. Filter by Status
    const completedRes = await fetch(`${BASE_URL}?status=Completed`);
    const completedTodos = await completedRes.json();
    assert(
      completedTodos.length === 1 && completedTodos[0]._id === todo1._id,
      'Filter Todos by Status=Completed'
    );

    const pendingRes = await fetch(`${BASE_URL}?status=Pending`);
    const pendingTodos = await pendingRes.json();
    assert(pendingTodos.length === 2, 'Filter Todos by Status=Pending returns 2 items');

    // 11. Status Counts
    const countsRes = await fetch(`${BASE_URL}/counts`);
    const counts = await countsRes.json();
    assert(
      counts.all === 3 && counts.completed === 1 && counts.pending === 2,
      'Get Status Counts returns correct statistics'
    );

    // 12. Delete Todo
    const deleteRes = await fetch(`${BASE_URL}/${todo3._id}`, {
      method: 'DELETE',
    });
    assert(deleteRes.status === 204, 'Delete Todo returns 204 No Content');

    // 13. Verify deleted is gone
    const verifyDeleteRes = await fetch(`${BASE_URL}/${todo3._id}`);
    assert(verifyDeleteRes.status === 404, 'Deleted Todo returns 404 Not Found');

    console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  } catch (err: any) {
    console.error('Unexpected error during testing:', err);
    failed++;
  } finally {
    server.close();
    await disconnectDB();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
